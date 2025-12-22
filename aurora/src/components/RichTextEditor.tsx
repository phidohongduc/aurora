import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Box, IconButton, Paper, Divider } from '@mui/material'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  disabled?: boolean
}

export function RichTextEditor({ content, onChange, disabled = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  const MenuButton = ({ 
    onClick, 
    active, 
    disabled, 
    children 
  }: { 
    onClick: () => void
    active?: boolean
    disabled?: boolean
    children: React.ReactNode 
  }) => (
    <IconButton
      size="small"
      onClick={onClick}
      disabled={disabled}
      sx={{
        minWidth: 32,
        height: 32,
        borderRadius: 1,
        bgcolor: active ? 'primary.50' : 'transparent',
        color: active ? 'primary.main' : 'text.secondary',
        '&:hover': {
          bgcolor: active ? 'primary.100' : 'grey.100',
        },
      }}
    >
      {children}
    </IconButton>
  )

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          p: 1,
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Text Formatting */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={disabled}
        >
          <Bold size={18} />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={disabled}
        >
          <Italic size={18} />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          disabled={disabled}
        >
          <UnderlineIcon size={18} />
        </MenuButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Headings */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          disabled={disabled}
        >
          <Heading1 size={18} />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          disabled={disabled}
        >
          <Heading2 size={18} />
        </MenuButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Lists */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          disabled={disabled}
        >
          <List size={18} />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          disabled={disabled}
        >
          <ListOrdered size={18} />
        </MenuButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Alignment */}
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          disabled={disabled}
        >
          <AlignLeft size={18} />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          disabled={disabled}
        >
          <AlignCenter size={18} />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          disabled={disabled}
        >
          <AlignRight size={18} />
        </MenuButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Undo/Redo */}
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
        >
          <Undo size={18} />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
        >
          <Redo size={18} />
        </MenuButton>
      </Box>

      {/* Editor Content */}
      <Box
        sx={{
          p: 2,
          minHeight: 300,
          maxHeight: 500,
          overflow: 'auto',
          '& .ProseMirror': {
            outline: 'none',
            '& > * + *': {
              marginTop: '0.75em',
            },
            '& ul, & ol': {
              paddingLeft: '1.5rem',
            },
            '& h1': {
              fontSize: '2rem',
              fontWeight: 'bold',
              lineHeight: 1.2,
            },
            '& h2': {
              fontSize: '1.5rem',
              fontWeight: 'bold',
              lineHeight: 1.3,
            },
            '& strong': {
              fontWeight: 'bold',
            },
            '& em': {
              fontStyle: 'italic',
            },
            '& u': {
              textDecoration: 'underline',
            },
            '& p.is-editor-empty:first-of-type::before': {
              content: '"Start typing your job description here..."',
              color: 'text.disabled',
              pointerEvents: 'none',
              height: 0,
              float: 'left',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  )
}
