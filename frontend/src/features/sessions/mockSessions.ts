export type SessionSummary = {
  id: string
  name: string
  tech: string
  statusLabel: string
  updatedLabel: string
  owner: string
  group: 'COBOL' | 'Ungrouped'
  createdAt: string
  description: string
}

export const SESSION_SUMMARIES: SessionSummary[] = [
  {
    id: 'cobol-sample',
    name: 'Cobol sample',
    tech: 'IBM ZOS ENTERPRISE COBOL',
    statusLabel: 'Ready',
    updatedLabel: 'Updated 3 min ago',
    owner: 'You',
    group: 'COBOL',
    createdAt: 'Feb 23, 2026, 9:20 AM',
    description: 'cobol · ibm_zos_enterprise_cobol · zip',
  },
  {
    id: 'cobol-for-poc',
    name: 'CobolForPOC',
    tech: 'IBM ZOS ENTERPRISE COBOL',
    statusLabel: 'Ready',
    updatedLabel: 'Updated 1 day ago',
    owner: 'You',
    group: 'Ungrouped',
    createdAt: 'Mar 12, 2026, 2:33 PM',
    description: 'cobol · ibm_zos_enterprise_cobol · zip',
  },
  {
    id: 'cobol-pilot',
    name: 'COBOL Project Pilot',
    tech: 'COBOL',
    statusLabel: 'Ready',
    updatedLabel: 'Updated 2 days ago',
    owner: 'You',
    group: 'Ungrouped',
    createdAt: 'Mar 11, 2026, 4:01 PM',
    description: 'cobol · multiple members · zip',
  },
  {
    id: 'ungrouped-1',
    name: 't9ecff02',
    tech: 'Mixed',
    statusLabel: 'Ready',
    updatedLabel: 'Updated 5 days ago',
    owner: 'You',
    group: 'Ungrouped',
    createdAt: 'Mar 08, 2026, 11:12 AM',
    description: 'mixed · analysis snapshot · zip',
  },
]

