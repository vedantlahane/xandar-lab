"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

interface Post {
    _id: string;
    content: string;
    authorId: {
        username: string;
        avatarGradient?: string;
    };
    createdAt: string;
}

export default function CommunityFeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeed() {
            try {
                const res = await fetch('/api/community/feed');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error("Failed to fetch feed", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeed();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-zinc-500 animate-pulse">Loading community feed...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Community Feed</h1>

            {posts.length === 0 ? (
                <div className="text-center p-8 bg-zinc-50/5 border border-zinc-200/10 rounded-xl text-zinc-400">
                    No posts yet. Be the first to share something!
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <Card key={post._id} className="bg-zinc-950 border-zinc-900 shadow-xl shadow-black/20">
                            <CardHeader className="pb-3 flex flex-row items-center gap-3 space-y-0">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                                    style={{ background: post.authorId.avatarGradient || 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' }}
                                >
                                    {post.authorId.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-zinc-100">{post.authorId.username}</span>
                                    <span className="text-xs text-zinc-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-zinc-300 whitespace-pre-wrap">{post.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
