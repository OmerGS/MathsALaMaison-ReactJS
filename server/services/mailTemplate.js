import { sendHtmlMail } from './mailService.js';

export function sendSignupMail(email, pseudo) {
  sendHtmlMail(
    email,
    `${pseudo}, bienvenue sur MathsALaMaison`,
    `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center;">
        <h1 style="color: #0a84ff; font-size: 28px; margin-bottom: 16px;">Bienvenue ${pseudo} ! 🎉</h1>
        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 24px;">
          Merci de vous être inscrit sur <strong>MathsÀLaMaison</strong> !<br />
          Votre compte est en attente de validation par notre administrateur.
        </p>
        <p style="font-size: 16px; color: #333333; line-height: 1.6;">
          Une fois accepté, vous recevrez un e-mail de confirmation et vous pourrez commencer à utiliser la plateforme pour apprendre les mathématiques de manière ludique. 🚀
        </p>
        <div style="margin-top: 40px;">
          <a href="https://mathsalamaison.fr" style="background-color: #0a84ff; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; display: inline-block;">
            Accéder au site
          </a>
        </div>
      </div>
      <p style="text-align: center; font-size: 12px; color: #999999; margin-top: 40px;">
        © ${new Date().getFullYear()} MathsALaMaison. Tous droits réservés.
      </p>
    </div>
    `
  );
}

export function sendNewDeviceMail(email, pseudo, ip, deviceInfo, date) {
  sendHtmlMail(
    email,
    `Nouvelle connexion à votre compte MathsALaMaison`,
    `
    <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color: #0a84ff;">Bonjour ${pseudo},</h2>
        <p>Une nouvelle connexion à votre compte <strong>MathsALaMaison</strong> a été détectée :</p>
        <ul style="font-size: 15px; color: #333;">
          <li><strong>Adresse IP :</strong> ${ip}</li>
          <li><strong>Appareil :</strong> ${deviceInfo}</li>
          <li><strong>Date :</strong> ${date.toLocaleString('fr-FR')}</li>
        </ul>
        <p>Si c'était vous, vous pouvez ignorer ce message.</p>
        <p>Si vous ne reconnaissez pas cette connexion, veuillez <a href="#">changer votre mot de passe immédiatement</a>.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #999;">© ${new Date().getFullYear()} MathsALaMaison</p>
      </div>
    </div>
    `
  );
}

export function sendApprovalMail(email, pseudo) {
  sendHtmlMail(
    email,
    `${pseudo}, votre compte MathsALaMaison a été approuvé`,
    `
    <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color: #0a84ff;">Bienvenue ${pseudo} !</h2>
        <p style="font-size: 15px; color: #333;">
          Nous avons le plaisir de vous informer que votre compte <strong>MathsALaMaison</strong> a été approuvé par notre équipe. 🎉
        </p>
        <p style="font-size: 15px; color: #333;">
          Vous pouvez dès maintenant accéder à la plateforme et commencer à apprendre les mathématiques de manière ludique et interactive.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mathsalamaison.fr" style="background-color: #0a84ff; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600;">
            Accéder à la plateforme
          </a>
        </div>
        <p style="font-size: 14px; color: #555;">Bon apprentissage,</p>
        <p style="font-size: 14px; color: #555;">L'équipe MathsALaMaison</p>
        <p style="margin-top: 30px; font-size: 12px; color: #999;">© ${new Date().getFullYear()} MathsALaMaison. Tous droits réservés.</p>
      </div>
    </div>
    `
  );
}

export function sendDisapprovalMail(email, pseudo) {
  sendHtmlMail(
    email,
    `Votre inscription à MathsALaMaison n'a pas été approuvée`,
    `
    <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color: #d32f2f;">Bonjour ${pseudo},</h2>
        <p style="font-size: 15px; color: #333;">
          Nous avons examiné votre demande d'inscription à <strong>MathsALaMaison</strong>, mais nous sommes au regret de vous informer qu’elle n’a pas été approuvée.
        </p>
        <p style="font-size: 15px; color: #333;">
          Cela peut être dû à un manque d'informations, une erreur dans votre inscription ou au fait que l'accès est réservé à certains membres pour le moment.
        </p>
        <p style="font-size: 15px; color: #333;">
          Si vous pensez qu’il s’agit d’une erreur, n’hésitez pas à nous contacter ou à réessayer ultérieurement.
        </p>
        <p style="font-size: 14px; color: #555;">Merci de votre compréhension,</p>
        <p style="font-size: 14px; color: #555;">L’équipe MathsALaMaison</p>
        <p style="margin-top: 30px; font-size: 12px; color: #999;">© ${new Date().getFullYear()} MathsALaMaison. Tous droits réservés.</p>
      </div>
    </div>
    `
  );
}

export function sendValidationCodeMail(email, code) {
  sendHtmlMail(
    email,
    `Votre code de vérification - MathsALaMaison`,
    `
    <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color: #0a84ff;">Bonjour,</h2>
        <p style="font-size: 15px; color: #333;">
          Voici votre code de vérification pour <strong>MathsALaMaison</strong> :
        </p>
        <div style="font-size: 24px; font-weight: bold; color: #0a84ff; margin: 20px 0; text-align: center;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #555;">
          Ce code est valable pendant <strong>10 minutes</strong>. Ne le partagez avec personne.
        </p>
        <p style="font-size: 14px; color: #555;">L'équipe MathsALaMaison</p>
        <p style="margin-top: 30px; font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} MathsALaMaison. Tous droits réservés.
        </p>
      </div>
    </div>
    `
  );
}

export function sendPasswordChangedMail(email, pseudo) {
  sendHtmlMail(
    email,
    `Votre mot de passe a été changé - MathsALaMaison`,
    `
    <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color: #0a84ff;">Bonjour ${pseudo},</h2>
        <p>Nous vous informons que le mot de passe de votre compte <strong>MathsALaMaison</strong> a été changé avec succès.</p>
        <p>Voici les détails de cette modification :</p>
        <p>Si c'était vous, aucune action supplémentaire n’est requise.</p>
        <p>Si vous ne reconnaissez pas cette modification, veuillez <a href="#">changer votre mot de passe immédiatement</a> et contacter notre support.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #999;">© ${new Date().getFullYear()} MathsALaMaison</p>
      </div>
    </div>
    `
  );
}