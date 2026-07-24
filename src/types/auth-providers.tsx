import { FaGithub, FaGoogle } from "react-icons/fa";

export const providers = [
  {
    id: "github",
    name: "GitHub",
    icon: FaGithub,
  },
  {
    id: "google",
    name: "Google",
    icon: FaGoogle,
  },
] as const;
