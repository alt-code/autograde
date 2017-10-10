package main.java.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

@WebServlet(urlPatterns="/api/users/*")
public class RESTDemo extends HttpServlet 
{

	public static class Days
	{
		public String user;
		public List<Weight> Weights;
	}
	
	public static class Weight
	{
		public Weight(String d, double w) {this.date = d; this.weight = w;}
		public String date;
		public double weight;
	}
	
	public void doGet( HttpServletRequest request,
            HttpServletResponse response ) throws IOException
	{
		// Parse user id from url.
		String user = request.getPathInfo();
		user = user.replace("/","");
		
		Days days = new Days();
		days.user = user;
		days.Weights = new ArrayList<Weight>();
		days.Weights.add(new Weight("12-21-2015", 123));
		days.Weights.add(new Weight("12-22-2016", 124));
		days.Weights.add(new Weight("12-23-2016", 125));
		days.Weights.add(new Weight("12-24-2016", 126));
		
		Gson gson = new Gson();
		
		final PrintWriter out = response.getWriter();
		out.write(gson.toJson(days));
	}
	
	
}