import React, { useState, useRef } from 'react';
import { X, ImagePlus, Video, Loader2, Hash, AtSign } from 'lucide-react';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PostVisibility, MediaType } from '@/types/community';
import { toast } from 'sonner';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export default function CreatePostModal({ open, onClose, onPostCreated }: CreatePostModalProps) {
  const { createPost, uploadMedia } = useCommunityPosts();
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<PostVisibility>('public');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractHashtags = (text: string): string[] => {
    const matches = text.match(/#[\w]+/g);
    return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
  };

  const extractMentions = (text: string): string[] => {
    const matches = text.match(/@[\w]+/g);
    return matches ? matches.map(mention => mention.slice(1).toLowerCase()) : [];
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (mediaFiles.length + files.length > 4) {
      toast.error('Maximum 4 media files allowed');
      return;
    }

    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isUnder10MB = file.size <= 10 * 1024 * 1024;

      if (!isImage && !isVideo) {
        toast.error(`${file.name}: Only images and videos allowed`);
        return false;
      }

      if (!isUnder10MB) {
        toast.error(`${file.name}: File too large (max 10MB)`);
        return false;
      }

      return true;
    });

    setMediaFiles(prev => [...prev, ...validFiles]);

    setUploading(true);
    try {
      const uploadPromises = validFiles.map(file => uploadMedia(file));
      const urls = await Promise.all(uploadPromises);
      setMediaUrls(prev => [...prev, ...urls]);
      toast.success('Media uploaded!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setSubmitting(true);
    try {
      const hashtags = extractHashtags(content);
      const mentions = extractMentions(content);

      let mediaType: MediaType | undefined;
      if (mediaUrls.length > 0) {
        const hasImages = mediaFiles.some(f => f.type.startsWith('image/'));
        const hasVideos = mediaFiles.some(f => f.type.startsWith('video/'));
        mediaType = hasImages && hasVideos ? 'mixed' : hasImages ? 'image' : 'video';
      }

      await createPost({
        content,
        visibility,
        media_urls: mediaUrls,
        media_type: mediaType,
        hashtags,
        mentions,
      });

      toast.success('Post created successfully!');
      resetForm();
      onClose();
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setVisibility('public');
    setMediaFiles([]);
    setMediaUrls([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const hashtags = extractHashtags(content);
  const mentions = extractMentions(content);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900/95 border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Create Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[150px] bg-black/40 border-gray-700 text-white resize-none"
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400">
                {content.length}/5000 characters
              </span>
              {(hashtags.length > 0 || mentions.length > 0) && (
                <div className="flex gap-1">
                  {hashtags.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Hash className="h-3 w-3 mr-1" />
                      {hashtags.length}
                    </Badge>
                  )}
                  {mentions.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <AtSign className="h-3 w-3 mr-1" />
                      {mentions.length}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {mediaUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {mediaUrls.map((url, index) => (
                <div key={index} className="relative group">
                  {mediaFiles[index]?.type.startsWith('image/') ? (
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={url}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading || mediaFiles.length >= 4}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || mediaFiles.length >= 4}
              className="border-gray-700"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              <span className="ml-2">Media</span>
            </Button>

            <Select value={visibility} onValueChange={(v) => setVisibility(v as PostVisibility)}>
              <SelectTrigger className="w-[140px] bg-black/40 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                'Publish'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
