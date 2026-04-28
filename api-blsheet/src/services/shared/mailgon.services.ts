import Mailgen from 'mailgen'
import { ENV } from '../../config'

class MailgenService {
  private mailGenerator

  constructor() {
    this.mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'BL SHEET',
        link: ENV.FRONTEND_URL!,
        logo: 'https://aws-api.blsheet.com/bl-sheet.png',
      },
    })
  }

  verificationEmailHTML({ name, link }: { name: string; link: string }) {
    var email = {
      body: {
        name,
        intro: "Welcome to BL Sheet We're very excited to have you on board.",
        action: {
          instructions:
            'We are happy you signed up for BL Sheet. To start exploring the BL Sheet App, please confirm your email address and create password by clicking below link:',
          button: {
            color: 'blue',
            text: 'Verify Email',
            link,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    }

    var emailHTML = this.mailGenerator.generate(email)
    var emailText = this.mailGenerator.generatePlaintext(email)

    return { emailHTML, emailText }
  }

  resetPasswordEmailHTML({ name, link }: { name: string; link: string }) {
    var email = {
      body: {
        name,
        intro: 'We received a request to reset your password on BL Sheet.',
        action: {
          instructions:
            "Click the button below to reset your password. If you didn't make this request, please ignore this email. The link below remain active for 1 hours.",
          button: {
            color: 'blue',
            text: 'Reset Password',
            link,
          },
        },
        outro:
          "If you have any questions, please don't hesitate to contact us.",
      },
    }

    var emailHTML = this.mailGenerator.generate(email)
    var emailText = this.mailGenerator.generatePlaintext(email)

    return { emailHTML, emailText }
  }

  inviteMemberHTML({
    name,
    link,
    projectName,
    inviteSenderName,
  }: {
    name: string
    link: string
    projectName: string
    inviteSenderName: string
  }) {
    var email = {
      body: {
        name,
        intro: `Invitation to Collaborate on ${projectName}`,
        action: {
          instructions: `${inviteSenderName} from BL Sheet has invited you to join ${projectName} and collaborate seamlessly on this exciting project. Click the button below to accept the invitation and get started right away:`,
          button: {
            color: 'blue',
            text: 'Accept Invitation',
            link,
          },
        },
        outro:
          'Please note that this link will remain active for the next 7 days',
      },
    }

    var emailHTML = this.mailGenerator.generate(email)
    var emailText = this.mailGenerator.generatePlaintext(email)

    return { emailHTML, emailText }
  }

  assignTaskHTML({
    assignee,
    link,
    projectAdminName,
  }: {
    assignee: string
    link: string
    projectAdminName: string
  }) {
    var email = {
      body: {
        name: assignee,
        intro: `${projectAdminName} has assigned you a task`,
        action: {
          instructions: `This task has been carefully designated to align with your expertise and project priorities. Please review the details and ensure its timely completion.`,
          button: {
            color: 'blue',
            text: 'View Task',
            link,
          },
        },
        outro: `For any clarifications or support, feel free to reach out to ${projectAdminName}  or your team lead.`,
      },
    }

    var emailHTML = this.mailGenerator.generate(email)
    var emailText = this.mailGenerator.generatePlaintext(email)

    return { emailHTML, emailText }
  }

  assignIssueHTML({
    assignee,
    link,
    projectAdminName,
  }: {
    assignee: string
    link: string
    projectAdminName: string
  }) {
    var email = {
      body: {
        name: assignee,
        intro: `${projectAdminName} has assigned you a issue`,
        action: {
          instructions: `This issue has been carefully designated to align with your expertise and project priorities. Please review the details and ensure its timely completion.`,
          button: {
            color: 'blue',
            text: 'View Issue',
            link,
          },
        },
        outro: `For any clarifications or support, feel free to reach out to ${projectAdminName}  or your team lead.`,
      },
    }

    var emailHTML = this.mailGenerator.generate(email)
    var emailText = this.mailGenerator.generatePlaintext(email)

    return { emailHTML, emailText }
  }

  assignDocHTML({
    projectName,
    assignee,
    link,
    documentName,
  }: {
    projectName: string
    assignee: string
    link: string
    documentName: string
  }) {
    var email = {
      body: {
        name: assignee,
        intro: `Assigned you a document`,
        action: {
          instructions: `A new document, ${documentName}, has been assigned to you as part of the ${projectName} project. Please review the document and take any necessary actions as required.`,
          button: {
            color: 'blue',
            text: 'View Task',
            link,
          },
        },
        outro: `For any clarifications or support, feel free to reach out to your team lead.`,
      },
    }

    var emailHTML = this.mailGenerator.generate(email)
    var emailText = this.mailGenerator.generatePlaintext(email)

    return { emailHTML, emailText }
  }
}

export default MailgenService
