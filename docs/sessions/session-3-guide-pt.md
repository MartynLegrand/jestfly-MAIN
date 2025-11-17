# 📚 GUIA COMPLETO - SISTEMA DE COMUNIDADE

## 🎯 VISÃO GERAL

Este guia completo documenta todo o sistema de comunidade implementado na Sessão 3, incluindo exemplos práticos de uso, integração e customização.

---

## 📦 ESTRUTURA DO PROJETO

```
project/
├── supabase/
│   └── migrations/
│       └── 20251117040000_create_community_system.sql
│
├── src/
│   ├── types/
│   │   └── community.ts
│   │
│   ├── hooks/
│   │   ├── useCommunityPosts.ts
│   │   ├── useCommunityComments.ts
│   │   ├── useCommunityFollows.ts
│   │   └── useCommunityNotifications.ts
│   │
│   └── components/
│       ├── community/
│       │   ├── PostFeed.tsx
│       │   ├── PostCard.tsx
│       │   ├── CreatePostModalNew.tsx
│       │   ├── CommentsListNew.tsx
│       │   ├── FollowButton.tsx
│       │   ├── NotificationCenter.tsx
│       │   └── CommunityFeedPage.tsx
│       │
│       └── admin/
│           └── sections/
│               └── CommunityModerationTab.tsx
```

---

## 🚀 QUICK START

### 1. Executar Migration

```bash
# 1. Abrir Supabase Dashboard
# 2. Ir para SQL Editor
# 3. Copiar todo o conteúdo de:
#    supabase/migrations/20251117040000_create_community_system.sql
# 4. Executar no SQL Editor
```

### 2. Adicionar Rotas

```tsx
// src/App.tsx
import CommunityFeedPage from '@/components/community/CommunityFeedPage';

function App() {
  return (
    <Routes>
      {/* ... outras rotas ... */}
      <Route path="/community/feed" element={<CommunityFeedPage />} />
    </Routes>
  );
}
```

### 3. Adicionar Notificações no Header

```tsx
// src/components/header/GlassHeader.tsx
import NotificationCenter from '@/components/community/NotificationCenter';

export default function GlassHeader() {
  return (
    <header>
      {/* ... outros elementos ... */}
      <NotificationCenter />
    </header>
  );
}
```

### 4. Testar!

```
1. Acesse: /community/feed
2. Clique em "Create Post"
3. Escreva algo e publique
4. Curta, comente e compartilhe!
```

---

## 💡 EXEMPLOS DE USO

### 1. Feed Básico

```tsx
import PostFeed from '@/components/community/PostFeed';

function MyFeed() {
  return (
    <div>
      <h1>Community Feed</h1>
      <PostFeed
        onCommentClick={(postId) => console.log('Open comments:', postId)}
      />
    </div>
  );
}
```

### 2. Feed Filtrado por Usuário

```tsx
function UserProfile({ userId }: { userId: string }) {
  return (
    <div>
      <h2>User Posts</h2>
      <PostFeed
        options={{ user_id: userId }}
        onCommentClick={handleCommentClick}
      />
    </div>
  );
}
```

### 3. Feed por Hashtag

```tsx
function HashtagPage({ hashtag }: { hashtag: string }) {
  return (
    <div>
      <h1>#{hashtag}</h1>
      <PostFeed
        options={{ hashtag: hashtag }}
        onCommentClick={handleCommentClick}
      />
    </div>
  );
}
```

### 4. Feed de Seguindo

```tsx
function FollowingFeed() {
  return (
    <div>
      <h2>Following</h2>
      <PostFeed
        options={{ following_only: true }}
        onCommentClick={handleCommentClick}
      />
    </div>
  );
}
```

### 5. Criar Post Programaticamente

```tsx
import { useCommunityPosts } from '@/hooks/useCommunityPosts';

function CreatePostButton() {
  const { createPost, uploadMedia } = useCommunityPosts();

  const handleCreatePost = async () => {
    // Upload de imagem
    const file = document.querySelector('input[type="file"]').files[0];
    const imageUrl = await uploadMedia(file);

    // Criar post
    await createPost({
      content: 'Check out this photo! #awesome',
      media_urls: [imageUrl],
      visibility: 'public',
      hashtags: ['awesome'],
      mentions: []
    });
  };

  return <button onClick={handleCreatePost}>Create Post</button>;
}
```

### 6. Sistema de Comentários

```tsx
import { useState } from 'react';
import CommentsListNew from '@/components/community/CommentsListNew';

function PostWithComments({ postId }: { postId: string }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <PostCard
        post={post}
        onComment={() => setShowComments(true)}
      />

      <CommentsListNew
        postId={postId}
        open={showComments}
        onClose={() => setShowComments(false)}
      />
    </>
  );
}
```

### 7. Follow Button em Perfil

```tsx
import FollowButton from '@/components/community/FollowButton';

function UserProfile({ userId }: { userId: string }) {
  return (
    <div>
      <h2>Profile</h2>
      <FollowButton
        userId={userId}
        variant="default"
        size="default"
        showIcon={true}
      />
    </div>
  );
}
```

### 8. Estatísticas de Usuário

```tsx
import { useCommunityFollows } from '@/hooks/useCommunityFollows';

function UserStats({ userId }: { userId: string }) {
  const { getFollowersCount, getFollowingCount } = useCommunityFollows(userId);

  return (
    <div>
      <div>{getFollowersCount()} Followers</div>
      <div>{getFollowingCount()} Following</div>
    </div>
  );
}
```

---

## 🎨 CUSTOMIZAÇÃO

### 1. Customizar Cores do Post Card

```tsx
// Editar src/components/community/PostCard.tsx

// Alterar gradiente do avatar
<Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-green-500">

// Alterar cor do like
<Heart className={`h-5 w-5 ${post.is_liked ? 'fill-red-500' : ''}`} />

// Alterar cor do badge
<Badge className="bg-blue-900/30 text-blue-400 border-blue-700/40">
```

### 2. Customizar Feed Layout

```tsx
// Criar componente customizado
function CustomPostFeed() {
  const { posts, loading } = useCommunityPosts();

  return (
    <div className="grid grid-cols-2 gap-4">
      {posts.map(post => (
        <CustomPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 3. Adicionar Filtros Customizados

```tsx
function FilteredFeed() {
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const { posts } = useCommunityPosts();

  const filteredPosts = posts.filter(post => {
    if (filter === 'images') return post.media_type === 'image';
    if (filter === 'videos') return post.media_type === 'video';
    return true;
  });

  return (
    <div>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="images">Images Only</option>
        <option value="videos">Videos Only</option>
      </select>

      {filteredPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 4. Adicionar Analytics

```tsx
import { useCommunityPosts } from '@/hooks/useCommunityPosts';

function PostWithAnalytics({ postId }: { postId: string }) {
  const { incrementViews } = useCommunityPosts();

  useEffect(() => {
    // Incrementar views quando post é visualizado
    incrementViews(postId);
  }, [postId]);

  return <PostCard post={post} />;
}
```

---

## 🔐 SEGURANÇA

### RLS Policies Implementadas

#### Posts
```sql
-- Qualquer um pode ler posts públicos aprovados
"Anyone can read public approved posts"

-- Usuários podem ler seus próprios posts
"Users can read their own posts"

-- Usuários podem ler posts de seguidores se seguem
"Users can read followers-only posts if they follow"

-- Admins podem ler todos os posts
"Admins can read all posts"

-- Usuários podem criar seus próprios posts
"Users can create their own posts"

-- Usuários podem atualizar seus próprios posts
"Users can update their own posts"

-- Admins podem atualizar qualquer post
"Admins can update any post"
```

#### Comentários
```sql
-- Qualquer um pode ler comentários aprovados em posts públicos
"Anyone can read approved comments on public posts"

-- Usuários podem ler seus próprios comentários
"Users can read their own comments"

-- Usuários autenticados podem criar comentários
"Authenticated users can create comments"

-- Usuários podem atualizar seus próprios comentários
"Users can update their own comments"
```

#### Likes
```sql
-- Qualquer um pode ler likes
"Anyone can read likes"

-- Usuários autenticados podem criar likes
"Authenticated users can create likes"

-- Usuários podem deletar seus próprios likes
"Users can delete their own likes"
```

#### Follows
```sql
-- Qualquer um pode ler follows
"Anyone can read follows"

-- Usuários autenticados podem criar follows
"Authenticated users can create follows"

-- Usuários podem deletar seus próprios follows
"Users can delete their own follows"
```

#### Notificações
```sql
-- Usuários podem ler suas próprias notificações
"Users can read their own notifications"

-- Sistema pode criar notificações
"System can create notifications"

-- Usuários podem atualizar suas próprias notificações
"Users can update their own notifications"
```

---

## 🛠️ TROUBLESHOOTING

### Problema: Posts não aparecem

**Solução:**
```typescript
// 1. Verificar se migration foi executada
// 2. Verificar se posts têm is_published = true
// 3. Verificar se posts têm moderation_status = 'approved'

// Debug:
const { data, error } = await supabase
  .from('community_posts')
  .select('*')
  .eq('is_published', true)
  .eq('moderation_status', 'approved');

console.log('Posts:', data);
console.log('Error:', error);
```

### Problema: Upload falha

**Solução:**
```typescript
// 1. Verificar se bucket 'community-media' existe
// 2. Verificar se storage policies estão configuradas
// 3. Verificar tamanho do arquivo (max 10MB)

// Debug:
const { data: buckets } = await supabase.storage.listBuckets();
console.log('Buckets:', buckets);

// Verificar policies
const { data: policies } = await supabase
  .from('storage.policies')
  .select('*')
  .eq('bucket_id', 'community-media');
console.log('Policies:', policies);
```

### Problema: Likes não funcionam

**Solução:**
```typescript
// 1. Verificar se user está autenticado
// 2. Verificar se triggers estão criados

// Debug:
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Testar like manualmente
const { data, error } = await supabase
  .from('community_likes')
  .insert({ post_id: 'post-uuid', user_id: user.id });
console.log('Like result:', data, error);
```

### Problema: Notificações não aparecem

**Solução:**
```typescript
// 1. Verificar se triggers de notification foram criados
// 2. Verificar RLS policies de notifications

// Debug:
const { data, error } = await supabase
  .from('community_notifications')
  .select('*')
  .eq('user_id', user.id);
console.log('Notifications:', data, error);
```

### Problema: Follow não funciona

**Solução:**
```typescript
// 1. Verificar se não é self-follow
// 2. Verificar unique constraint

// Debug:
const { data, error } = await supabase
  .from('community_follows')
  .insert({
    follower_id: user.id,
    following_id: targetUserId
  });
console.log('Follow result:', data, error);
```

---

## 📊 PERFORMANCE

### Indexes Criados

```sql
-- Posts
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_hashtags ON community_posts USING gin(hashtags);
CREATE INDEX idx_community_posts_moderation_status ON community_posts(moderation_status);

-- Comments
CREATE INDEX idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX idx_community_comments_created_at ON community_comments(created_at DESC);

-- Likes
CREATE INDEX idx_community_likes_user_id ON community_likes(user_id);
CREATE INDEX idx_community_likes_post_id ON community_likes(post_id);
CREATE INDEX idx_community_likes_comment_id ON community_likes(comment_id);

-- Follows
CREATE INDEX idx_community_follows_follower_id ON community_follows(follower_id);
CREATE INDEX idx_community_follows_following_id ON community_follows(following_id);

-- Notifications
CREATE INDEX idx_community_notifications_user_id ON community_notifications(user_id);
CREATE INDEX idx_community_notifications_is_read ON community_notifications(is_read);
```

### Otimizações

1. **Counters Cacheados**
   - likes_count, comments_count, shares_count são atualizados via triggers
   - Evita COUNT(*) queries lentas

2. **Pagination**
   - Infinite scroll com limit/offset
   - Busca apenas 10-20 posts por vez

3. **Lazy Loading**
   - Media é carregada sob demanda
   - Intersection Observer para scroll

4. **Optimistic Updates**
   - UI atualiza imediatamente
   - Reverte se servidor falhar

---

## 🔄 REAL-TIME (Preparado)

### Ativar Real-time Updates

```typescript
// No hook useCommunityPosts
const subscribeToFeed = () => {
  const subscription = supabase
    .channel('posts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'community_posts',
      },
      (payload) => {
        setPosts(prev => [payload.new as CommunityPost, ...prev]);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'community_posts',
      },
      (payload) => {
        setPosts(prev => prev.map(p =>
          p.id === payload.new.id ? payload.new as CommunityPost : p
        ));
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

useEffect(() => {
  const unsubscribe = subscribeToFeed();
  return unsubscribe;
}, []);
```

---

## 📱 MOBILE RESPONSIVE

Todos os componentes são totalmente responsivos:

- **PostCard**: Stack vertical em mobile
- **PostFeed**: Single column em mobile
- **CommentsListNew**: Full screen em mobile
- **NotificationCenter**: Dropdown ajustado para mobile
- **CreatePostModal**: Full screen em mobile

---

## 🎯 PRÓXIMOS PASSOS

### Features Sugeridas

1. **Direct Messages**
   - Chat 1-on-1
   - Group chats
   - Message notifications

2. **Stories**
   - 24h stories
   - View counter
   - Swipe navigation

3. **Live Streaming**
   - Go live button
   - Live comments
   - View counter

4. **Polls**
   - Create polls in posts
   - Vote tracking
   - Results visualization

5. **Advanced Search**
   - Search users
   - Search posts
   - Search hashtags
   - Filters

6. **Analytics Dashboard**
   - Post engagement
   - Follower growth
   - Top posts
   - Trending topics

7. **User Verification**
   - Verified badge
   - Verification request
   - Admin approval

8. **Content Scheduling**
   - Schedule posts
   - Draft posts
   - Post queue

---

## 📚 REFERÊNCIAS

### Documentação
- [Supabase Docs](https://supabase.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Shadcn UI](https://ui.shadcn.com/)

### Código
- `/src/hooks/useCommunityPosts.ts`
- `/src/components/community/PostFeed.tsx`
- `/supabase/migrations/20251117040000_create_community_system.sql`

---

## 💬 SUPORTE

### Erros Comuns

**TypeError: Cannot read property 'profiles' of undefined**
```tsx
// Sempre verificar se profiles existe
{post.profiles?.username || 'Unknown'}
```

**RLS Error: permission denied**
```sql
-- Verificar policies no Supabase Dashboard
-- Garantir que user está autenticado
```

**Upload failed: File too large**
```tsx
// Verificar tamanho do arquivo
if (file.size > 10 * 1024 * 1024) {
  toast.error('File too large (max 10MB)');
  return;
}
```

---

## 🎉 CONCLUSÃO

O sistema de comunidade está completo e pronto para uso em produção. Siga este guia para integrar, customizar e estender as funcionalidades conforme necessário.

**Happy Coding!** 🚀
