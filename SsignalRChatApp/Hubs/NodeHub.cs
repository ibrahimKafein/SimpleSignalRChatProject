using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SsignalRChatApp
{
    public class NodeHub : Hub<ITypedHubClient>
    {
        public void Send(string name, string message)
        {
            Clients.All.NotifyMessageToClients(name, message);
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendMessage(user, message);
        }

        public async Task DeadMessage(string user, string message)
        {
            await Clients.All.DeadMessage(user, message);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            String connctionId = Context.ConnectionId.ToString();
            await base.OnDisconnectedAsync(exception);
            await DeadMessage(connctionId, new DateTime().ToString());
        }

        public override async Task OnConnectedAsync()
        {
            String connctionId = Context.ConnectionId.ToString();
            await base.OnConnectedAsync();

            // if signalR client version include connection.hub.id recomment this 
            //code and comment getconnctionid method
            //await Clients.All.SendMessage(connctionId, "i am alive");
        }

        public string getConnectionId()
        {
            return Context.ConnectionId.ToString();
        }

    }
    
}
