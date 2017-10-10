package main.java.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;

import main.models.Todo;

@Path("/users/{id}/todos/{todo}")	  
public class JerseyREST 
{
	  @GET 
	  public Response getTodo(@PathParam("id") String id, @PathParam("todo") String todoId) 
	  {
		  // "Fetch 'TODO' from DB"
		  Todo todo = new Todo();
		  todo.id = todoId;
		  todo.description = "todo from user " + id;
		  todo.summary = "remember the milk";
		  String json = new Gson().toJson(todo);
		  return Response.ok(json, MediaType.APPLICATION_JSON).build();
	  }

	 @POST
	  @Produces(MediaType.TEXT_HTML)
	  @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	  public void newTodo(@FormParam("id") String id,
	      @FormParam("summary") String summary,
	      @FormParam("description") String description,
	      @Context HttpServletResponse servletResponse) throws IOException {

	    servletResponse.sendRedirect("/");
	  }
	 
}
