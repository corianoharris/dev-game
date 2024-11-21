import { FC } from 'react'
import MonacoEditor from '@monaco-editor/react'

interface EditorProps
{
    value: string
    onChange: (value: string) => void
    language?: string
    height?: string
}

export const Editor: FC<EditorProps> = ({
    value,
    onChange,
    language = 'javascript',
    height = '400px'
}) =>
{
    return (
        <MonacoEditor
            height={height}
            language={language}
            value={value}
            onChange={(value) => onChange(value || '')}
            theme="vs-dark"
            options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 2,
                automaticLayout: true,
            }}
        />
    )
}