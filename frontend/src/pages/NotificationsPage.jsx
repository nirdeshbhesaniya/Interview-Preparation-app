import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Bell,
    Check,
    X,
    AlertCircle,
    Info,
    CheckCircle,
    Clock,
    Trash2
} from 'lucide-react';
import Button from '../components/ui/SimpleButton';
import Card from '../components/ui/SimpleCard';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'success',
            title: 'MCQ Test Completed',
            message: 'You scored 85% on JavaScript Fundamentals test',
            time: '2 hours ago',
            read: false,
            action: 'View Results'
        },
        {
            id: 2,
            type: 'info',
            title: 'New Feature Available',
            message: 'Code execution platform is now live with 5 programming languages',
            time: '1 day ago',
            read: false,
            action: 'Try Now'
        },
        {
            id: 3,
            type: 'warning',
            title: 'Profile Incomplete',
            message: 'Complete your profile to get personalized recommendations',
            time: '2 days ago',
            read: true,
            action: 'Complete Profile'
        }
    ]);

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'error':
                return <X className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        toast.success('Marked as read');
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
        toast.success('All notifications marked as read');
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        toast.success('Notification deleted');
    };

    const clearAll = () => {
        setNotifications([]);
        toast.success('All notifications cleared');
    };

    if (!user) {
        navigate('/');
        return null;
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                                {unreadCount > 0 && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={markAllAsRead}
                                variant="outline"
                                size="sm"
                                disabled={unreadCount === 0}
                                className="flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Mark All Read
                            </Button>
                            <Button
                                onClick={clearAll}
                                variant="outline"
                                size="sm"
                                disabled={notifications.length === 0}
                                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {notifications.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No notifications
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            You're all caught up! Check back later for updates.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="animate-fade-in"
                            >
                                <Card className={`p-4 ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {getIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">{notification.time}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-4">
                                                    {notification.action && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {notification.action}
                                                        </Button>
                                                    )}

                                                    {!notification.read && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-1 h-8 w-8"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-1 h-8 w-8 text-gray-400 hover:text-red-500"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
