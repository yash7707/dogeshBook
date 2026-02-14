 // Get dog avatar color based on name
  export const getAvatarColor = (name) => {
    if (!name) return "var(--primary-blue, #4A6FA5)";

    const colors = [
      "var(--primary-blue, #4A6FA5)",
      "var(--secondary-coral, #FF8A7A)",
      "var(--grass-green, #68D391)",
      "var(--accent-yellow, #FFD166)",
      "var(--paw-pink, #FFB7C5)",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get first letter of dog name for avatar
  export const getAvatarLetter = (name) => {
    if (!name) return "🐶";
    return name.charAt(0).toUpperCase();
  };

