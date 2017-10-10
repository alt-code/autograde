package main.java.servlets;

import java.io.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.sql.DataSource;
import javax.servlet.annotation.WebServlet;

@WebServlet("/users")
public class ITrustUsersServlet extends HttpServlet {
 
   // Runs when the servlet is loaded onto the server.
   public void init() 
   {
      
   }
 
   // Runs on a thread whenever there is HTTP GET request
   // Take 2 arguments, corresponding to HTTP request and response
   public void doGet(HttpServletRequest request, HttpServletResponse response)
         throws IOException, ServletException {
 
      // Set the MIME type for the response message
      response.setContentType("text/html");
      // Write to network
      PrintWriter out = response.getWriter();
 
      // Your servlet's logic here
      out.println("<html>");
      
      List<String> list = new ArrayList<String>();
      list.add("alice");
      list.add("bobby");
      list.add("jian");
      list.add("kumar");
      list.add("zenu");

      out.println("<ul>");

      for( String user : list  )
      {
    	  out.println("<li>"+ user +"</li>");
      }
      

      out.println("<ul>");
      out.println("</html>");
   }
 
   // Runs as a thread whenever there is HTTP POST request
   public void doPost(HttpServletRequest request, HttpServletResponse response)
         throws IOException, ServletException {
      // do the same thing as HTTP GET request
      doGet(request, response);
   }
 
   // Runs when the servlet is unloaded from the server.
   public void destroy() {
   }
 
   // Other instance variables and methods
 }