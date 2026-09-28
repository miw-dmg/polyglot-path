import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  kind?: 'trial' | 'contact'
  name?: string
  email?: string
  course?: string
  slot?: string
  message?: string
}

const AdminNotification = ({ kind = 'contact', name, email, course, slot, message }: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>{kind === 'trial' ? `Nouvelle séance d'essai : ${name ?? ''}` : `Nouveau message de ${name ?? ''}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>PolyLinguist</Text>
        <Heading style={h1}>
          {kind === 'trial' ? "Nouvelle réservation de séance d'essai" : 'Nouveau message de contact'}
        </Heading>
        <Hr style={hr} />
        <Section>
          <Text style={label}>Nom</Text>
          <Text style={value}>{name || '—'}</Text>
          <Text style={label}>Email</Text>
          <Text style={value}>{email || '—'}</Text>
          {kind === 'trial' ? (
            <>
              <Text style={label}>Cours</Text>
              <Text style={value}>{course || '—'}</Text>
              <Text style={label}>Créneau (heure de Paris)</Text>
              <Text style={value}>{slot || '—'}</Text>
            </>
          ) : (
            <>
              <Text style={label}>Message</Text>
              <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message || '—'}</Text>
            </>
          )}
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminNotification,
  subject: (d: Record<string, any>) =>
    d.kind === 'trial'
      ? `Séance d'essai réservée — ${d.name ?? ''}`
      : `Nouveau message de contact — ${d.name ?? ''}`,
  displayName: 'Notification interne (essai / contact)',
  to: 'contact@polylinguist.fr',
  previewData: { kind: 'trial', name: 'Jane Dupont', email: 'jane@example.com', course: 'Business English', slot: 'lundi 5 octobre 2026 à 10:00' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', color: '#1a1a1a' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brand = { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#5f7a64', margin: '0 0 16px' }
const h1 = { fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 'normal', margin: '0 0 16px' }
const hr = { borderColor: '#e5e5e5', margin: '16px 0' }
const label = { fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#777', margin: '12px 0 2px' }
const value = { fontSize: '15px', margin: '0' }
