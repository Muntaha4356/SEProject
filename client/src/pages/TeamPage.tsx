import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";

const TeamPage = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team Members</h1>
            <p className="text-muted-foreground">Invite and manage your organization's team</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        <Card className="p-12 rounded-xl shadow-soft">
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Build Your Team</h2>
            <p className="text-muted-foreground mb-6">
              Collaborate with your team members to manage campaigns, view analytics, and track donations together.
            </p>
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg">
              <Plus className="mr-2 h-4 w-4" />
              Invite Team Members
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeamPage;
