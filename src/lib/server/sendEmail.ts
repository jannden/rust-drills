import { env } from '@/env.mjs'
import { postmark } from '@/lib/postmark'

export enum EmailTemplate {
  Welcome = 'welcome',
  VerificationCode = 'verification-code',
}

export type EmailConfig = {
  template: EmailTemplate
  userEmail: string
  data?: Record<string, string>
}

type LocaleAndEmail = {
  locale: string
  userEmail: string
}

export type EmailVerificationCodeInput = LocaleAndEmail & {
  data: { otpCode: string; requestedAt: string; requestedBy: string; requestedFrom: string }
}

export type EmailLayoutData = {
  app_name: string
  all_rights_reserved: string
  company_name: string
  company_address: string
}

export type EmailVerificationCodeData = EmailLayoutData & {
  subject: string
  title: string
  enter_this: string
  verification_code: string
  protect_info: string
  did_not_request_title: string
  did_not_request_info: string
}

export async function sendEmailVerificationCode({ locale, userEmail, data }: EmailVerificationCodeInput) {
  const modelData: EmailVerificationCodeData = {
    app_name: env.NEXT_PUBLIC_APP_NAME,
    all_rights_reserved: 'all_rights_reserved',
    company_name: env.NEXT_PUBLIC_APP_COMPANY,
    company_address: env.NEXT_PUBLIC_APP_ADDRESS,
    subject: 'VerificationCode.subject',
    title: 'VerificationCode.title',
    enter_this: 'VerificationCode.enter_this',
    verification_code: data.otpCode,
    protect_info: 'VerificationCode.protect_info',
    did_not_request_title: 'VerificationCode.did_not_request_title',
    did_not_request_info: 'VerificationCode.did_not_request_info',
  }

  postmark.sendEmailWithTemplate({
    From: env.NEXT_PUBLIC_APP_EMAIL,
    To: userEmail,
    TemplateAlias: EmailTemplate.VerificationCode,
    TemplateModel: modelData,
  })
}
