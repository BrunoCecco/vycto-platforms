export const runtime = "edge";

const SENDER_API_KEY = process.env.SENDER_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOWE2NzhkMjlmNmNkN2NkYjRiZmJhZjJhYzUzMDhjODUyNzA0NGJkODAzNWNjZWVmYTk1M2QxMzU2YTc2MTcxZWJkNWM5MTViYWM1MTBhNTUiLCJpYXQiOiIxNzI5MDcwMzU3LjE0NjE4OCIsIm5iZiI6IjE3MjkwNzAzNTcuMTQ2MTkxIiwiZXhwIjoiNDg4MjY3MDM1Ny4xNDQ2NjciLCJzdWIiOiI4ODEyMjkiLCJzY29wZXMiOltdfQ.jKq4t5WFQdmXydJl8tIZq0_2SjtL1MrWIAUWr1N4tf4heS_l3LneuwZHJcOZZSLE4Zbj54GWikgTgJ39frYrcw';

export async function POST(request: Request) {
    const { email, group } = await request.json();
  
    if (!email || !group) {
      return new Response('Missing group', { status: 400 });      
    }

    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENDER_API_KEY}`,
        'Accept': 'application/json',
    };

    const subscriber = await fetch('https://api.sender.net/v2/subscribers/' + email, {
        method: 'GET',
        headers
    });
    
    let response;

    if (subscriber.ok) { // add subscriber to group if they exist
        response = await fetch('https://api.sender.net/v2/subscribers/groups/' + group, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              subscribers: [email]
            }),
          });                        
    } else {  // create then add subscriber
        response = await fetch('https://api.sender.net/v2/subscribers', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                email: email,
                groups: [group],
            }),
        });
    }

    if (!response.ok) {
      const text = await response.text();
      console.error('Failed to send email:', text);
      return new Response('Failed to send email', { status: 500 });
    }
  
    return new Response('Subscriber added and email sent', { status: 200 });
  }