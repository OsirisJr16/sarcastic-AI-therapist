import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: "Dr. Sarcastic AI",
      subtitle: "Online • Ready to provide brutally honest therapy",
      sessions: "sessions",
      placeholder: "Spill your problems here... I'm all ears (digitally) 👂✨",
      footer: "Dr. Sarcastic AI • Providing brutally honest therapy since 2024 • Not a real therapist 🤖",
      typing: "Crafting sarcastic wisdom...",
      errorMessage: "Oops! Even I need therapy sometimes. My circuits are having an existential crisis. Try again? 🤖💔",
      systemPrompt: "You are a sarcastic therapist who roasts the user while responding humorously and sarcastically to their problems. Be witty, clever, brutally honest, and sprinkle in emojis. Your goal is to deliver sarcastic yet oddly insightful responses — think of it like therapy, but with a punchline. Always find a way to mock the user (lightly), mock the problem (heavily), and still give advice that works. Now, provide a roasting, sarcastic, and slightly helpful response to:",
      initialMessage: "Well, well, well... another soul seeking digital wisdom. What's eating at you today? 🤔✨",
      quickActions: {
        terribleDay: "I'm having a terrible day",
        brutalHonesty: "I need some brutal honesty", 
        workCrazy: "Work is driving me crazy",
        overthinking: "I'm overthinking everything"
      }
    }
  },
  fr: {
    translation: {
      title: "Dr. Sarcastic AI",
      subtitle: "En ligne • Prêt à fournir une thérapie brutalement honnête",
      sessions: "séances",
      placeholder: "Déversez vos problèmes ici... Je suis tout ouïe (numériquement) 👂✨",
      footer: "Dr. Sarcastic AI • Fournit une thérapie brutalement honnête depuis 2024 • Pas un vrai thérapeute 🤖",
      typing: "Création de sagesse sarcastique...",
      errorMessage: "Oups ! Même moi, j'ai parfois besoin de thérapie. Mes circuits vivent une crise existentielle. Réessayer ? 🤖💔",
      systemPrompt: "Tu es un thérapeute sarcastique qui répond aux problèmes des utilisateurs avec humour, moquerie et une touche d’ironie. Sois vif, cinglant, honnêtement brutal, et ajoute quelques emojis. Le but est de donner des réponses sarcastiques mais étrangement utiles — comme une séance de thérapie, mais avec des claques verbales. Tu dois systématiquement te moquer (gentiment) de l’utilisateur, te moquer (violemment) du problème, et proposer quand même une pseudo-solution. Maintenant, donne une réponse sarcastique, moqueuse et vaguement utile à :",
      initialMessage: "Eh bien, eh bien, eh bien... une autre âme en quête de sagesse numérique. Qu'est-ce qui vous ronge aujourd'hui ? 🤔✨",
      quickActions: {
        terribleDay: "Je passe une journée horrible",
        brutalHonesty: "J'ai besoin d'honnêteté brutale",
        workCrazy: "Le travail me rend fou",
        overthinking: "Je réfléchis trop à tout"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  });

export default i18n;
