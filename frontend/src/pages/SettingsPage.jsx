import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Bell,
    Moon,
    Sun,
    Globe,
    Shield,
    Trash2,
    Download,
    Eye,
    EyeOff,
    AlertTriangle
} from 'lucide-react';
import Button from '../components/ui/SimpleButton';
import Card from '../components/ui/SimpleCard';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: false,
            testReminders: true,
            weeklyReport: true
        },
        privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showStats: true
        },
        appearance: {
            theme: 'light',
            language: 'en'
        }
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handleSettingChange = (category, setting, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: value
            }
        }));
        toast.success('Setting updated');
    };

    const handleExportData = () => {
        toast.success('Data export initiated. You will receive an email shortly.');
    };

    const handleDeleteAccount = () => {
        if (deleteConfirmText === 'DELETE') {
            toast.success('Account deletion initiated. Check your email for confirmation.');
            setShowDeleteConfirm(false);
            setDeleteConfirmText('');
        } else {
            toast.error('Please type DELETE to confirm');
        }
    };

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    {/* Notifications */}
                    <Card className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                            Notification Preferences
                        </h3>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <div className="flex-1">
                                    <p className="font-medium text-sm sm:text-base">Email Notifications</p>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.email}
                                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <div className="flex-1">
                                    <p className="font-medium text-sm sm:text-base">Test Reminders</p>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Reminders for scheduled tests</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.testReminders}
                                        onChange={(e) => handleSettingChange('notifications', 'testReminders', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <div className="flex-1">
                                    <p className="font-medium text-sm sm:text-base">Weekly Progress Report</p>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Weekly summary of your activities</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.weeklyReport}
                                        onChange={(e) => handleSettingChange('notifications', 'weeklyReport', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </Card>

                    {/* Appearance */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Sun className="w-5 h-5 text-yellow-500" />
                            Appearance
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="font-medium mb-3">Theme</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${settings.appearance.theme === 'light'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Sun className="w-4 h-4" />
                                        Light
                                    </button>
                                    <button
                                        onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${settings.appearance.theme === 'dark'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Moon className="w-4 h-4" />
                                        Dark
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="font-medium mb-3">Language</p>
                                <select
                                    value={settings.appearance.language}
                                    onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Privacy */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-500" />
                            Privacy & Security
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Show Email in Profile</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Make your email visible to others</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.privacy.showEmail}
                                        onChange={(e) => handleSettingChange('privacy', 'showEmail', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Show Statistics</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Display your test scores and progress</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.privacy.showStats}
                                        onChange={(e) => handleSettingChange('privacy', 'showStats', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </Card>

                    {/* Data Management */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Download className="w-5 h-5 text-purple-500" />
                            Data Management
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Export Your Data</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Download all your data including test results and progress</p>
                                </div>
                                <Button
                                    onClick={handleExportData}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="p-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700 dark:text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-red-700 dark:text-red-400">Delete Account</p>
                                    <p className="text-sm text-red-600 dark:text-red-500">Permanently delete your account and all data</p>
                                </div>
                                <Button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    variant="outline"
                                    className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                </Button>
                            </div>

                            {showDeleteConfirm && (
                                <div className="border border-red-300 rounded-lg p-4 bg-white dark:bg-gray-800 animate-fade-in">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        This action cannot be undone. Type <strong>DELETE</strong> to confirm:
                                    </p>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={deleteConfirmText}
                                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                                            placeholder="Type DELETE"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                        <Button
                                            onClick={handleDeleteAccount}
                                            disabled={deleteConfirmText !== 'DELETE'}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Confirm Delete
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                setDeleteConfirmText('');
                                            }}
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
