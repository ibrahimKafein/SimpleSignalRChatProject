using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SsignalRChatApp.Models;
using SignalRChat.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace SsignalRChatApp.Controllers
{
    public class HomeController : Controller
    {
        protected AppDbContext mContext;
        IHubContext<NodeHub, ITypedHubClient> nodeHubContext;

        public HomeController(AppDbContext context, IHubContext<NodeHub, ITypedHubClient> hubContext)
        {
            mContext = context;
            nodeHubContext = hubContext;
        }

        public IActionResult Index()
        {
            MessengerNodeViewModel user = new MessengerNodeViewModel() { Value = HttpContext.Connection.Id, TimeStamp = new DateTime() };
            //try
            //{
            //    mContext.Database.EnsureCreated();
            //    mContext.Node.Add(user);
            //    mContext.SaveChanges();
            //}catch(Exception e)
            //{
            //    //ignore log
            //}
            // to to broadcatst "i am new" message from server side
            //nodeHubContext.Clients.All.NotifyMessageToClients(user.Id,HttpContext.Connection.Id);

            ViewData["Title"] = String.IsNullOrEmpty(user.Id) ? HttpContext.Connection.Id.ToString() : user.Id;
            return View();
        }


        public IActionResult About()
        {
            ViewData["Title"] = "Chat";
            ViewData["Message"] = " .net core 2.0 , entitty framework 6.2.0 , signalR 2.4.1";
            return View();
        }

      
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Add([Bind("Value,SourceNode,TargetNode")] MessageViewModel model)
        {
            if (ModelState.IsValid)
            {
                mContext.Message.Add(model);
            }
            mContext.SaveChanges();

            return View("Index");
        }
    }
}
