export const runtime = "edge";

const SENDER_API_KEY = process.env.SENDER_API_KEY;

// get a group details
export async function GET(
  request: Request,
  { params }: { params: { group: string } },
) {
  const { group } = params;

  if (!group) {
    return new Response("Missing groupId", { status: 400 });
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SENDER_API_KEY}`,
    Accept: "application/json",
  };

  try {
    // Fetch group details
    const response = await fetch(`https://api.sender.net/v2/groups/${group}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return new Response("Failed to fetch group", { status: 500 });
    }

    const groupData = await response.json();
    return new Response(JSON.stringify(groupData), { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

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
        let res = campaigns.data;
        // if (group) {
        //   res = campaigns.data.filter((campaign: any) =>
        //     campaign.campaign_groups.includes(group),
        //   );
        // }
        res = campaigns.data.filter(
          (campaign: any) => campaign.status == "DRAFT",
        );
        return new Response(JSON.stringify(res), { status: 200 });
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

        console.log(subData.data.length);

        const unsubResonse = subData.data.map(async (sub: any) => {
          let res = await fetch(
            `https://api.sender.net/v2/subscribers/${sub.email}`,
            {
              method: "PATCH",
              headers,
              body: JSON.stringify({
                transactional_email_status: "UNSUBSCRIBED",
              }),
            },
          );
        });

        const subResonse = emails.map(async (email) => {
          const subscriber = await fetch(
            "https://api.sender.net/v2/subscribers/" + email,
            {
              method: "GET",
              headers,
            },
          );

          let response;

          if (subscriber.ok) {
            // add subscriber to group if they exist
            response = await fetch(
              "https://api.sender.net/v2/subscribers/groups/" + group,
              {
                method: "POST",
                headers,
                body: JSON.stringify({
                  subscribers: [email],
                }),
              },
            );
          } else {
            // create then add subscriber
            response = await fetch("https://api.sender.net/v2/subscribers", {
              method: "POST",
              headers,
              body: JSON.stringify({
                email: email,
                groups: [group],
              }),
            });
          }

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
          const resp = await response.json();
          console.log(resp);
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
