import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import InputBase from '@mui/material/InputBase'
import Typography from '@mui/material/Typography'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SearchIcon from '@mui/icons-material/Search'

export type ProgramDocument = {
  id: string
  code: string
  count: number
  markdown: string
}

const createDetailDesignMarkdown = (programId: string): string => {
  return `<!--
name: detail-design
description: COBOL Detail Design documentation (詳細設計書)
document_kind: detail_design
scope: program
output_language: "Japanese (日本語)"
-->

# ${programId} — 詳細設計書

- システム名：内線調査システム
- プログラムID：${programId}
- 作成日：2026/03/11
- 版数：1.0
- 生成元：自動生成（COBOLソース解析）

---

## 1. 改訂履歴

| 版数 | 日付       | 変更者 | 変更内容                             |
| ---- | ---------- | ------ | ------------------------------------ |
| 1.0  | 2026/03/11 | System | 初版（自動生成）                     |
| -    | 2002/02    | -      | ZH -> HD 移行, 委託先追加対応        |
| -    | 2007/11/22 | -      | お客さま番号１６桁化対応             |
| -    | 2010/03/05 | -      | 定期調査管理Ｓのチェック機能強化     |
| -    | 2010/04/30 | -      | 営業Ｓ基盤整備本番化対応             |
| -    | 2010/05/01 | -      | 営業拠点営配データ連係対応           |
| -    | 2018/05/31 | -      | 法的分離の配電Ｓ改修（連係変更）     |

---

## 2. プログラム仕様

### 2.0 プログラム概要

| 項目                 | 値                     |
| -------------------- | ---------------------- |
| **プログラム名**     | ${programId}               |
| **業務名**           | 内線調査システム       |
| **処理概要**         | 調査マスターメンテナンス |
| **言語**             | COBOL                  |
| **プログラムタイプ** | バッチ                 |
| **作成者**           | Y-SHIRAI               |
| **作成日**           | 1974/12/02             |

### 2.1 処理構成図

\`\`\`mermaid
flowchart TD
    CUSTINFO["CUSTINFO / UT-S-SYS011"] -->|"INPUT"| ${programId}
    CHOSAMI["CHOSAMI / UT-S-SYS012"] -->|"INPUT"| ${programId}
    ${programId} -->|"OUTPUT"| CHOSAMO["CHOSAMO / UT-S-SYS013"]
\`\`\`

### 2.2 備考

- この文書はCOBOLソース解析に基づいて自動生成されました。
- 詳細なCOPY句情報については、ソースファイルを参照してください。
- JCL定義は別途管理されています。

---

## 3.プログラム仕様詳細

このセクションには、プログラムの処理ロジック、主要な段落（SECTION / PARAGRAPH）、ファイル入出力、照会・更新ロジックなどの詳細が記載されます。

（サンプルでは HD89A012 の仕様をベースにしています。実運用では ${programId} 専用の情報に差し替えます。）
`
}

const PROGRAM_GROUP_LABEL = 'Programs'

export const PROGRAM_DOCUMENTS: ProgramDocument[] = [
  { id: 'HD89M150', code: 'HD89M150', count: 2, markdown: createDetailDesignMarkdown('HD89M150') },
  { id: 'HD89A012', code: 'HD89A012', count: 2, markdown: createDetailDesignMarkdown('HD89A012') },
  { id: 'HD89M110', code: 'HD89M110', count: 1, markdown: createDetailDesignMarkdown('HD89M110') },
  { id: 'HD89M130', code: 'HD89M130', count: 2, markdown: createDetailDesignMarkdown('HD89M130') },
  { id: 'HD89M160', code: 'HD89M160', count: 1, markdown: createDetailDesignMarkdown('HD89M160') },
  { id: 'HD89A300', code: 'HD89A300', count: 2, markdown: createDetailDesignMarkdown('HD89A300') },
  { id: 'HD89M100', code: 'HD89M100', count: 1, markdown: createDetailDesignMarkdown('HD89M100') },
  { id: 'HD89A001', code: 'HD89A001', count: 1, markdown: createDetailDesignMarkdown('HD89A001') },
  { id: 'HD89Q140', code: 'HD89Q140', count: 2, markdown: createDetailDesignMarkdown('HD89Q140') },
  { id: 'CONDSET6', code: 'CONDSET6', count: 2, markdown: createDetailDesignMarkdown('CONDSET6') },
]

export interface DocumentsPanelProps {
  documents?: ProgramDocument[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function DocumentsPanel({
  documents,
  selectedId,
  onSelect,
}: DocumentsPanelProps) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const data = documents ?? PROGRAM_DOCUMENTS

  const filteredPrograms = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return data
    return data.filter((doc) =>
      doc.code.toLowerCase().includes(trimmed),
    )
  }, [data, query])

  const totalPrograms = data.length

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'transparent',
      }}
    >
      <DocumentsPanelHeader total={totalPrograms} />

      {/* Search */}
      <Box sx={{ px: 1.5, pb: 1, pt: 1.25 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.25,
            py: 0.75,
            borderRadius: '10px',
            bgcolor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'var(--glass-blur)',
            transition: 'all 0.18s ease',
            '&:focus-within': {
              borderColor: 'var(--accent)',
              boxShadow: 'var(--focus-ring)',
              bgcolor: 'var(--glass-hover-bg)',
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 15, color: 'var(--text-secondary)', flexShrink: 0 }} />
          <InputBase
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter documents..."
            sx={{
              fontSize: 12.5,
              color: 'var(--text-primary)',
              '& input::placeholder': {
                color: 'var(--text-secondary)',
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>

      {/* Group header */}
      <Box
        sx={{
          px: 2,
          pb: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {PROGRAM_GROUP_LABEL}
        </Typography>
        <Box
          sx={{
            px: 0.9,
            py: 0.15,
            borderRadius: 999,
            bgcolor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
          }}
        >
          <Typography sx={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>
            {filteredPrograms.length}
          </Typography>
        </Box>
      </Box>

      {/* List */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 0.75,
          pb: 1.5,
        }}
      >
        {filteredPrograms.length === 0 ? (
          <Box sx={{ px: 2, py: 2.5 }}>
            <Typography sx={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
              No documents yet. Start analysis and wait for generated markdown files.
            </Typography>
          </Box>
        ) : (
        <List dense disablePadding>
          {filteredPrograms.map((doc) => {
            const isSelected = doc.id === selectedId
            const isExpanded = expanded[doc.id] ?? false

            const toggleExpanded = () => {
              setExpanded((prev) => ({
                ...prev,
                [doc.id]: !isExpanded,
              }))
            }

            return (
              <Box key={doc.id} sx={{ mb: 0.25 }}>
                {/* Folder row */}
                <ListItemButton
                  onClick={toggleExpanded}
                  sx={{
                    borderRadius: '10px',
                    mx: 0.25,
                    px: 1.1,
                    py: 0.55,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    bgcolor: 'transparent',
                    color: 'var(--text-secondary)',
                    '&:hover': {
                      bgcolor: 'var(--glass-hover-bg)',
                      color: 'var(--text-primary)',
                    },
                  }}
                >
                  {/* Chevron */}
                  {isExpanded ? (
                    <ExpandMoreIcon sx={{ fontSize: 16, opacity: 0.9 }} />
                  ) : (
                    <ChevronRightIcon sx={{ fontSize: 16, opacity: 0.9 }} />
                  )}

                  {/* Folder icon */}
                  <FolderOutlinedIcon
                    sx={{
                      fontSize: 16,
                      color: 'var(--accent)',
                    }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: 'inherit',
                        textTransform: 'uppercase',
                        letterSpacing: 0.4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {doc.code}
                    </Typography>
                    <Box
                      sx={{
                        px: 0.8,
                        py: 0.1,
                        borderRadius: 999,
                        border: '1px solid var(--border)',
                        bgcolor: 'var(--glass-bg)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                        }}
                      >
                        {doc.count}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>

                {/* Child file row */}
                {isExpanded && (
                  <ListItemButton
                    onClick={() => onSelect(doc.id)}
                    selected={isSelected}
                    sx={{
                      borderRadius: '10px',
                      mx: 1.75,
                      mt: 0.15,
                      px: 1.8,
                      py: 0.6,
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid transparent',
                      transition: 'all 0.18s ease',
                      '&.Mui-selected': {
                        background: 'var(--glass-hover-bg)',
                        borderColor: 'var(--accent)',
                        boxShadow:
                          'var(--glass-inset-highlight-subtle), var(--glass-shadow)',
                        '&:hover': {
                          background: 'var(--glass-hover-bg)',
                          borderColor: 'var(--accent-hover)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '20%',
                          bottom: '20%',
                          width: 3,
                          borderRadius: '0 3px 3px 0',
                          background: 'var(--accent)',
                        },
                      },
                      '&:not(.Mui-selected):hover': {
                        bgcolor: 'var(--glass-bg)',
                        borderColor: 'var(--glass-border)',
                      },
                    }}
                  >
                    <ListItemText
                      disableTypography
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.75,
                            }}
                          >
                            <DescriptionOutlinedIcon
                              sx={{
                                fontSize: 16,
                                color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: 12.5,
                                fontWeight: isSelected ? 600 : 500,
                                color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                                fontFeatureSettings: '"tnum" 1, "lnum" 1',
                                letterSpacing: 0.1,
                                transition: 'color 0.18s ease',
                              }}
                            >
                              detail_design.md
                            </Typography>
                          </Box>
                          <Box
                            sx={{ flexShrink: 0 }}
                          />
                        </Box>
                      }
                    />
                  </ListItemButton>
                )}
              </Box>
            )
          })}
        </List>
        )}
      </Box>
    </Box>
  )
}

interface DocumentsPanelHeaderProps {
  total: number
}

function DocumentsPanelHeader({ total }: DocumentsPanelHeaderProps) {
  return (
    <Box
      sx={{
        px: 2,
        pt: 1.75,
        pb: 1.25,
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--glass-hover-bg)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-glow)',
            color: 'var(--accent)',
            flexShrink: 0,
          }}
        >
          <FolderOpenOutlinedIcon sx={{ fontSize: 17 }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
            Documents
          </Typography>
          <Typography
            sx={{ color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1 }}
          >
            {PROGRAM_GROUP_LABEL} · {total} items
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
