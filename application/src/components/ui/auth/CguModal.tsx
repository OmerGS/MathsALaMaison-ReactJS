"use client";

import React, { useState } from "react";
import FormButton from "@/components/ui/auth/FormButton";

export default function CguModal({
  onAccept,
}: {
  onAccept: () => void;
}) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-white/30">
        <div className="relative bg-white max-w-3xl w-full h-[80vh] overflow-y-auto p-6 rounded-xl shadow-lg z-10">
        <h2 className="text-2xl font-bold mb-4">Conditions Générales d'Utilisation</h2>
        <div className="text-sm space-y-4 overflow-y-auto max-h-[60vh] text-justify">
          <p><strong>Mentions légales de mathsalamaison.fr :</strong></p>
          <p>Merci de lire avec attention les différentes modalités d’utilisation du présent site avant d’y parcourir ses pages. En vous connectant sur ce site, vous acceptez sans réserve les présentes modalités. Aussi, conformément à l’article n°6 de la Loi n°2004-575 du 21 Juin 2004 pour la confiance dans l’économie numérique, les responsables du présent site internet MathALaMaison.fr sont :</p>
          <p><strong>Éditeur du Site :</strong><br/>MathsALaMaison – Aude Montiège<br/>Responsable éditorial : Aude Montiège<br/>Entreprise gérée par Aude Montiège<br/>N° Siret: 951 783 141 000 17<br/>8 rue de l’île Holavre 56610 Arradon<br/>Téléphone : 0660783126<br/>Email : am@mathsalamaison.fr<br/>Site Web : MathALaMaison.fr</p>
          <p><strong>Hébergement :</strong> OVH – 2 rue Kellermann – 59100 Roubaix – France – www.ovh.fr</p>
          <p><strong>Développement :</strong> Projet SAE réalisé par des étudiants de l'IUT de Vannes</p>

          <p><strong>Conditions d’utilisation :</strong><br/>Ce site est proposé en différents langages web pour un meilleur confort d’utilisation et un graphisme plus agréable. Nous recommandons l’usage de navigateurs modernes. L’équipe met en œuvre tous les moyens pour offrir une information fiable, mais des erreurs peuvent survenir. L’internaute doit donc vérifier l’exactitude des informations.</p>

          <p><strong>Cookies :</strong><br/>Le site utilise uniquement des cookies nécessaires à la gestion des sessions utilisateurs (ex : JWT pour authentification).</p>

          <p><strong>Liens hypertextes :</strong><br/>MathsALaMaison.fr peut contenir des liens vers d’autres sites. Nous ne sommes pas responsables de leur contenu. Toute mise en place d’un lien vers notre site nécessite une autorisation expresse.</p>

          <p><strong>Services fournis :</strong><br/>Nous nous efforçons de fournir une application respectant les normes RGPD. Les questions sont à but éducatif.</p>

          <p><strong>Limitation contractuelle sur les données :</strong><br/>Si vous constatez un problème, merci de nous le signaler. Tout téléchargement est à vos risques. L’utilisateur s’engage à utiliser un matériel récent et sécurisé.</p>

          <p><strong>Propriété intellectuelle :</strong><br/>Tout le contenu du site est la propriété exclusive de MathsALaMaison sauf mentions contraires. Toute reproduction est interdite sans autorisation écrite. Le non-respect engage la responsabilité civile et pénale du contrefacteur.</p>

          <p><strong>Déclaration à la CNIL :</strong><br/>Ce site n’est pas soumis à déclaration à la CNIL conformément à la loi Informatique et Libertés.</p>

          <p><strong>Litiges :</strong><br/>Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents du siège social de l’éditeur.</p>

          <p><strong>Données personnelles :</strong><br/>En général, vous n’avez pas à fournir de données personnelles. Toutefois, certaines fonctionnalités comme les formulaires nécessitent la communication de données comme votre email. Vous pouvez refuser, mais certains services vous seront alors inaccessibles. Des données techniques peuvent aussi être collectées pour améliorer le service.</p>

          <p><strong>Condition d’inscription :</strong><br/>Un compte lié à une adresse mail valide est nécessaire pour accéder au site. Le mot de passe est chiffré sur le serveur.</p>
        </div>

        <div className="flex items-center mt-6 space-x-4">
          <input
            type="checkbox"
            id="accept"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="accept" className="text-sm">
            J’ai lu et j’accepte les conditions générales d’utilisation.
          </label>
        </div>

        <div className="mt-6 flex justify-center">
          <FormButton onClick={handleAccept} disabled={!accepted}>
            Continuer
          </FormButton>
        </div>
      </div>
    </div>
  );
}
