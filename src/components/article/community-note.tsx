'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, User, Clock, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime, cn } from '@/lib/utils'

interface CommunityNoteProps {
  note: {
    id: string
    content: string
    status: string
    helpfulVotes: number
    notHelpfulVotes: number
    user: { name?: string | null }
    createdAt: Date
  }
  onVoteHelpful?: (noteId: string, helpful: boolean) => void
  userVote?: boolean | null
}

export function CommunityNote({ note, onVoteHelpful, userVote }: CommunityNoteProps) {
  const totalVotes = note.helpfulVotes + note.notHelpfulVotes
  const helpfulPercentage =
    totalVotes > 0 ? (note.helpfulVotes / totalVotes) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            Community Note
          </span>
          {note.status === 'APPROVED' && (
            <Badge variant="verified" className="text-xs">
              Verified
            </Badge>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-zinc-500">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(note.createdAt)}
        </span>
      </div>

      <p className="mb-3 text-sm text-amber-800 dark:text-amber-200">
        {note.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <User className="h-3 w-3" />
          {note.user.name || 'Anonymous'}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            {helpfulPercentage.toFixed(0)}% found helpful
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVoteHelpful?.(note.id, true)}
            className={cn(
              'h-8 px-2',
              userVote === true && 'bg-green-100 text-green-700 dark:bg-green-900/30'
            )}
          >
            <ThumbsUp className="mr-1 h-3 w-3" />
            {note.helpfulVotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVoteHelpful?.(note.id, false)}
            className={cn(
              'h-8 px-2',
              userVote === false && 'bg-red-100 text-red-700 dark:bg-red-900/30'
            )}
          >
            <ThumbsDown className="mr-1 h-3 w-3" />
            {note.notHelpfulVotes}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

interface AddCommunityNoteProps {
  articleId: string
  onSubmit: (content: string) => Promise<void>
}

export function AddCommunityNote({ articleId, onSubmit }: AddCommunityNoteProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent('')
      setIsOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <MessageSquarePlus className="mr-2 h-4 w-4" />
        Add Community Note
      </Button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
    >
      <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Add Context to This Article
      </h4>
      <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        Help others by adding relevant context, fact-checks, or additional
        information about this article.
      </p>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add helpful context about this article..."
        className="mb-3"
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          loading={isSubmitting}
        >
          Submit Note
        </Button>
      </div>
    </motion.div>
  )
}
