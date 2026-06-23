/**
 * Packing Slip PDF Utility
 *
 * Generates a minimal packing slip containing ONLY:
 * - Order ID
 * - Order Date
 * - Product table (Name, Variant, SKU, Qty)
 *
 * NO customer details (name, phone, address) are included.
 */

const PDFDocument = require('pdfkit');

const StoreSettings = require('../models/StoreSettings');

/**
 * Generate packing slip PDF buffer
 * @param {Object} order - Populated order document
 * @returns {Promise<Buffer>}
 */
const generatePackingSlipPDF = async (order) => {
    const settings = await StoreSettings.findOne() || {};
    const companyName = settings.companyTradeName || 'Arbuda accessories';
    const companyTagline = 'Packing Slip';

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 40 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            // ── Header ──
            doc.fontSize(20).font('Helvetica-Bold').text(companyName, 40, 40);
            doc.fontSize(14).font('Helvetica').text(companyTagline, 40, 65, { color: '#666' });
            doc.moveTo(40, 90).lineTo(555, 90).stroke('#ccc');

            // ── Order Info ──
            const infoY = 105;
            doc.fontSize(11).font('Helvetica-Bold').text('Order Number:', 40, infoY);
            doc.font('Helvetica').text(order.orderNumber || '-', 160, infoY);

            doc.font('Helvetica-Bold').text('Order Date:', 40, infoY + 18);
            doc.font('Helvetica').text(formatDate(order.createdAt), 160, infoY + 18);

            doc.font('Helvetica-Bold').text('Status:', 40, infoY + 36);
            doc.font('Helvetica').text(order.status || 'PACKED', 160, infoY + 36);

            doc.font('Helvetica-Bold').text('Total Items:', 350, infoY);
            const totalQty = (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
            doc.font('Helvetica').text(totalQty.toString(), 440, infoY);

            doc.moveTo(40, infoY + 60).lineTo(555, infoY + 60).stroke('#ccc');

            // ── Items Table ──
            const tableTop = infoY + 75;
            const colWidths = [30, 220, 120, 80, 65];
            const headers = ['#', 'Product Name', 'Variant', 'SKU', 'Qty'];

            // Table header background
            doc.rect(40, tableTop, 515, 22).fill('#f4f4f4');
            doc.fillColor('#000');

            let x = 40;
            doc.fontSize(9).font('Helvetica-Bold');
            headers.forEach((header, i) => {
                const align = i === 4 ? 'center' : 'left';
                doc.text(header, x + 5, tableTop + 6, { width: colWidths[i] - 10, align });
                x += colWidths[i];
            });

            // Table rows
            let y = tableTop + 27;
            doc.font('Helvetica').fontSize(9);

            (order.items || []).forEach((item, index) => {
                // Alternate row background
                if (index % 2 === 1) {
                    doc.rect(40, y - 3, 515, 20).fill('#fafafa');
                    doc.fillColor('#000');
                }

                x = 40;
                const rowData = [
                    (index + 1).toString(),
                    item.name || 'Unknown Product',
                    item.variantName || '-',
                    item.sku || '-',
                    item.quantity.toString(),
                ];

                rowData.forEach((data, i) => {
                    const align = i === 4 ? 'center' : 'left';
                    doc.text(data, x + 5, y, { width: colWidths[i] - 10, align });
                    x += colWidths[i];
                });

                y += 20;

                // Page break if needed
                if (y > 750) {
                    doc.addPage();
                    y = 40;
                }
            });

            // Table border
            doc.rect(40, tableTop, 515, y - tableTop + 5).stroke('#ddd');

            // ── Footer ──
            const footerY = Math.max(y + 30, 650);
            doc.moveTo(40, footerY).lineTo(555, footerY).stroke('#ccc');

            doc.fontSize(8).font('Helvetica')
                .text('This is an auto-generated packing slip. No customer details are included for privacy.', 40, footerY + 8, {
                    align: 'center',
                    width: 515,
                });

            // Checkbox line for warehouse
            doc.fontSize(9).font('Helvetica-Bold').text('Packed by: _______________', 40, footerY + 30);
            doc.text('Date: _______________', 300, footerY + 30);
            doc.text('Signature: _______________', 40, footerY + 50);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

module.exports = { generatePackingSlipPDF };
