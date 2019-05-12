using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SsignalRChatApp
{
    public interface ITypedHubClient
    {
        Task NotifyMessageToClients(string name, string message);
        Task SendMessage(string name, string message);
        Task DeadMessage(string user, string message);
    }
}
