/**
 * Admin Wishlist Routes
 * View all user wishlists from the admin panel
 */

const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { authenticate, adminOnly } = require('../../middleware/auth.middleware');

router.use(authenticate, adminOnly);

/**
 * GET /api/v1/admin/wishlists
 * Get all users with their wishlist data (paginated)
 */
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const users = await User.find({ 'wishlist.0': { $exists: true } })
            .select('name phone email wishlist createdAt')
            .populate({
                path: 'wishlist',
                select: 'name sellingPrice mrp images slug',
                options: { strictPopulate: false }
            })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await User.countDocuments({ 'wishlist.0': { $exists: true } });

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Admin get wishlists error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wishlists'
        });
    }
});

/**
 * GET /api/v1/admin/wishlists/stats
 * Get most wishlisted products
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await User.aggregate([
            { $unwind: '$wishlist' },
            { $group: { _id: '$wishlist', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    'product.name': 1,
                    'product.sellingPrice': 1,
                    'product.images': 1
                }
            }
        ]);

        res.json({ success: true, data: { stats } });
    } catch (error) {
        console.error('Wishlist stats error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch wishlist stats' });
    }
});

module.exports = router;
