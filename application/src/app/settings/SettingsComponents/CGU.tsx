import React from "react";

const CGU = () => {
  return (
    <div className="space-y-4 text-gray-800 leading-relaxed">
      <p className="font-semibold">⚠️ Informations à confirmer avec la cliente</p>

      <p>
        Cette application collecte et stocke certaines données utilisateur sur un serveur sécurisé
        hébergé à l’extérieur de l'appareil. Cela comprend, par exemple, le nom, l'adresse e-mail,
        les préférences d'utilisation, ainsi que les scores et progrès réalisés dans l'application.
        Ces informations sont nécessaires pour garantir une expérience personnalisée, permettre la
        synchronisation entre plusieurs appareils et assurer une sauvegarde fiable des données.
      </p>

      <p>
        Aucune donnée sensible (comme les mots de passe ou données bancaires) n'est collectée ni
        conservée. L’accès à ces données est strictement réservé à l’équipe de développement, dans
        le respect du RGPD, et peut être supprimé à la demande de l’utilisateur.
      </p>
    </div>
  );
};

export default CGU;