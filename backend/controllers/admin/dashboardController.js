import User from '../../models/User.js';
import Tasker from '../../models/Tasker.js';
import Booking from '../../models/Booking.js';

export const getDashboardData = async (req, res) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments();
    const totalTaskers = await Tasker.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingApprovals = await Tasker.countDocuments({ status: 'pending' });
    
    // Active users and taskers
    const activeUsers = await User.countDocuments({ status: 'active' });
    const activeTaskers = await Tasker.countDocuments({ status: 'approved' });
    
    // Booking statistics
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const inProgressBookings = await Booking.countDocuments({ status: 'in-progress' });
    
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    const recentTaskers = await Tasker.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    const recentBookings = await Booking.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Calculate revenue from completed bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    // Get monthly statistics for trends
    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalUsers,
      totalTaskers,
      totalBookings,
      pendingApprovals,
      activeUsers,
      activeTaskers,
      completedBookings,
      pendingBookings,
      inProgressBookings,
      recentUsers,
      recentTaskers,
      recentBookings,
      totalRevenue,
      monthlyStats
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};
