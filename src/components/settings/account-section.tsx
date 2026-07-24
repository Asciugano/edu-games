"use client";

import { ProfileCard } from "@/components/account/profile-card";
import { PersonalInformationForm } from "@/components/account/personal-information-form";
import { SecurityCard } from "@/components/account/security-card";
import { authClient } from "@/lib/auth-client";

export default function AccountSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="space-y-6">
      <ProfileCard
        name={user.name}
        email={user.email}
        image={user.image}
        level={user.level}
        xp={user.totalXp}
        streak={user.streak}
        onChangeAvatar={() => {}}
      />

      <PersonalInformationForm />

      <SecurityCard />
    </div>
  );
}
