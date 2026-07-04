import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { User, Phone, Save, Sparkles, Camera } from 'lucide-react';

export default function ProfilePage() {
    const { user, updateUser, _hasHydrated } = useAuthStore();
    const router = useRouter();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!_hasHydrated) return; // Wait for hydration before checking auth state

        if (!user) {
            router.push('/login');
        } else {
            setName(user.name || '');
            setPhone(user.phone || '');
            if (user.avatar) {
                setAvatarPreview(user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_ASSETS_URL}${user.avatar}`);
            }
        }
    }, [user, router, _hasHydrated]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const data = await authApi.updateProfile(formData);
            if (data.success) {
                updateUser({
                    name: data.data.name,
                    phone: data.data.phone,
                    avatar: data.data.avatar
                });
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    if (!_hasHydrated || !user) return null;

    return (
        <div className="min-h-screen bg-[var(--surface)] dark:bg-[#0a0a0f]">
            <SEO
                title="My Profile — Account Settings"
                description="Update your ToolBasketAI account details, profile photo, and contact information."
                canonical="/profile"
                noIndex={true}
            />
            <Navbar />

            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 -z-10">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>

            {/* Floating Elements */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-[var(--accent)]/30 rounded-full blur-3xl animate-float -z-10"></div>
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float -z-10" style={{ animationDelay: '1s' }}></div>

            <div className="flex items-center justify-center min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full animate-fadeIn">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] px-4 py-2 rounded-full mb-4">
                            <Sparkles className="text-[var(--accent)]" size={16} />
                            <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">Your Profile</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                            <span className="gradient-text">Edit Profile</span>
                        </h2>
                    </div>

                    <Card variant="elevated" className="p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center mb-6">
                                <div
                                    className="relative w-24 h-24 rounded-full bg-[var(--surface)] dark:bg-[var(--accent-soft)] border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[var(--accent)] transition-colors group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar Preview" loading="lazy" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-[var(--text-faint)] dark:text-[var(--text-faint)]" size={40} />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-[var(--text)] dark:text-[var(--text)]" size={24} />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] mt-2">Click to change avatar</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-2">
                                    Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="text-[var(--text-faint)] dark:text-[var(--text-faint)]" size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="bg-[var(--bg)] border border-[var(--border-strong)] w-full pl-10 pr-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] text-[var(--text)] dark:text-[var(--text)] placeholder-[var(--text-faint)] transition-smooth"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="text-[var(--text-faint)] dark:text-[var(--text-faint)]" size={20} />
                                    </div>
                                    <input
                                        type="tel"
                                        className="bg-[var(--bg)] border border-[var(--border-strong)] w-full pl-10 pr-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] text-[var(--text)] dark:text-[var(--text)] placeholder-[var(--text-faint)] transition-smooth"
                                        placeholder="+1 234 567 8900"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            {message.text && (
                                <div className={`glass-strong border-l-4 p-4 rounded ${message.type === 'success' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                loading={loading}
                            >
                                <Save size={20} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
}
