"use client";

import React from "react";

const MentionsLegales = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 leading-relaxed space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Mentions Légales</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
        <p>
          <strong>Nom :</strong> MathsALaMaison – Aude Montiège<br />
          <strong>Responsable :</strong> Aude Montiège<br />
          <strong>SIRET :</strong> 951 783 141 000 17<br />
          <strong>Adresse :</strong> 8 rue de l’île Holavre, 56610 Arradon<br />
          <strong>Téléphone :</strong> 06 60 78 31 26<br />
          <strong>Email :</strong> am@mathsalamaison.fr<br />
          <strong>Site web :</strong> www.mathsalamaison.fr
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
        <p>
          <strong>Hébergeur :</strong> OVH<br />
          2 rue Kellermann – 59100 Roubaix – France<br />
          <strong>Site web :</strong> www.ovh.fr
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Développement</h2>
        <p>
          <strong>Agence / Réalisation :</strong> Projet SAE réalisé par des étudiants de l'IUT de Vannes
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p>
          L’ensemble des contenus présents sur ce site (textes, images, sons, vidéos, logos, code source, etc.) est protégé par le Code de la propriété intellectuelle et le droit d’auteur. Toute reproduction, représentation ou adaptation, intégrale ou partielle, est strictement interdite sans autorisation écrite préalable.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Cookies</h2>
        <p>
          Le site utilise uniquement des cookies nécessaires à la gestion des sessions utilisateurs (ex : JWT pour authentification). Aucun autre cookie à des fins publicitaires ou analytiques n’est déployé.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Limitation de responsabilité</h2>
        <p>
          L’éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l’utilisation ou de l’impossibilité d’utiliser ce site, y compris la perte de données, de profits ou tout autre préjudice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Liens hypertextes</h2>
        <p>
          Le site peut contenir des liens vers des sites tiers. L’éditeur décline toute responsabilité quant au contenu et à l’accès de ces sites externes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Données personnelles</h2>
        <p>
          Aucune donnée personnelle n’est collectée sans le consentement explicite de l’utilisateur. Les informations collectées lors de la création de compte sont utilisées uniquement pour la gestion du compte et sont protégées conformément au RGPD.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Déclaration CNIL</h2>
        <p>
          Ce site n’est pas soumis à déclaration auprès de la CNIL conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Droit applicable et litiges</h2>
        <p>
          Les présentes mentions légales sont régies par le droit français. Tout litige relatif à l’utilisation du site sera soumis aux tribunaux compétents du siège social de l’éditeur. La langue de référence est le français.
        </p>
      </section>
    </div>
  );
};

export default MentionsLegales;