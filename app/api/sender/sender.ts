export const runtime = "edge";

const SENDER_API_KEY = process.env.SENDER_API_KEY;

export async function POST(request: Request) {
  const { action, group, emails, campaignId } = await request.json();

  if (!action || !SENDER_API_KEY) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SENDER_API_KEY}`,
    Accept: "application/json",
  };

  try {
    switch (action) {
      case "campaigns": {
        // Fetch all campaigns
        const response = await fetch("https://api.sender.net/v2/campaigns", {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          return new Response("Failed to fetch campaigns", { status: 500 });
        }

        const campaigns = await response.json();
        return new Response(JSON.stringify(campaigns), { status: 200 });
      }

      case "replaceSubscribers": {
        if (!group || !emails || !Array.isArray(emails)) {
          return new Response("Missing or invalid groupId/emails", {
            status: 400,
          });
        }

        // Clear existing subscribers from the group
        const subsResponse = await fetch(
          `https://api.sender.net/v2/groups/${group}/subscribers`,
          {
            method: "GET",
            headers,
          },
        );

        const subData = await subsResponse.json();

        const unsubResonse = subData.map(async (sub: any) => {
          await fetch(`https://api.sender.net/v2/subscribers/${sub.email}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({
              transactional_email_status: "UNSUBSCRIBED",
            }),
          });
        });

        const subResonse = emails.map(async (email) => {
          const subRes = await fetch(`/api/subscribe/`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              email: email,
              group: group,
            }),
          });

          const activate = await fetch(
            `https://api.sender.net/v2/subscribers/${email}`,
            {
              method: "PATCH",
              headers,
              body: JSON.stringify({
                transactional_email_status: "ACTIVE",
              }),
            },
          );
        });

        if (!unsubResonse.ok) {
          return new Response("Failed to add subscribers", { status: 500 });
        }

        return new Response("Subscribers updated successfully", {
          status: 200,
        });
      }

      case "sendCampaign": {
        if (!campaignId) {
          return new Response("Missing campaignId", { status: 400 });
        }

        // Trigger campaign send
        const response = await fetch(
          `https://api.sender.net/v2/campaigns/${campaignId}/send`,
          {
            method: "POST",
            headers,
          },
        );

        if (!response.ok) {
          return new Response("Failed to send campaign", { status: 500 });
        }

        return new Response("Campaign sent successfully", { status: 200 });
      }

      default:
        return new Response("Invalid action", { status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
