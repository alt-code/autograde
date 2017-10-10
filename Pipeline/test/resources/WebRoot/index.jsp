<%@page import="org.apache.commons.fileupload.servlet.ServletFileUpload" %>
<%@page import="org.apache.commons.fileupload.DefaultFileItemFactory" %>
<%@page import="org.apache.commons.fileupload.FileItemFactory" %>
<%@page import="org.apache.commons.fileupload.FileItem" %>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.util.Base64" %>
<%@page import="org.apache.commons.io.IOUtils" %>
<html>
<head><title>First JSP</title></head>
<body>
  <%
    double num = Math.random();
    if (num > 0.95) {
  %>
      <h2>You'll have a luck day!</h2><p>(<%= num %>)</p>
  <%
    } else {
  %>
      <h2>Well, life goes on ... </h2><p>(<%= num %>)</p>
  <%
    }
  %>
  
<% 
	boolean isMultipart = ServletFileUpload.isMultipartContent(request);

	if(!isMultipart){
%>
		<form name="mainForm" enctype="multipart/form-data" action="index.jsp" method="post">
			<table class="fTable mainTable" align="center">
				<tr><th colspan="3">Choose File</th></tr>		
				<tr>
					<td>
					<input name="imgFile" type="file"/>
					</td>
					<td>
						<input type="submit" value="Send File" id="sendFile" name="sendFile">
					</td>
				</tr>
			</table>
		</form>
<%
	}else{
		
		InputStream fileStream = null;
		boolean ignore = true;

		FileItemFactory factory = new DefaultFileItemFactory();
		ServletFileUpload upload = new ServletFileUpload(factory);

		List<FileItem> items = upload.parseRequest(request);
		
		for( FileItem item: items)
		{
		    if (item.isFormField()) 
		    {
		    } 
		    else 
		    {
		    	fileStream = item.getInputStream();
		    }
		}

		if(fileStream!=null)
		{
			byte[] imageData = IOUtils.toByteArray(fileStream);
			String base64 = Base64.getEncoder().encodeToString(imageData);
			%>
				<div>Uploaded</div>
				<img src=data:image/png;base64,<%=base64%>>		
			<%
		}
	}
	
%>



  <img src="/JSPDemo/chart" >
  
  <a href="<%= request.getRequestURI() %>"><h3>Try Again</h3></a>
  

  <script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
  
  <h3>Demo "Real" REST</h3>
  <div id="todoNote">
  </div>

   <script>
	  $.getJSON("/JSPDemo/rest/users/10/todos/1", function(data) 
	   {
			$("#todoNote").append( JSON.stringify(data) );	  
	   });
  </script>
  <h3>Highcharts Version</h3>
  
  <div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
  
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script>
	  $.getJSON("/JSPDemo/api/users/10", function(data) 
	   {
		  var days = [];
		  for( var i = 0; i < data.Weights.length; i++ )
		  {
			  days.push(data.Weights[i].date);
		  }
		  var weights = [];
		  for( var i = 0; i < data.Weights.length; i++ )
		  {
			  weights.push(data.Weights[i].weight);
		  }
		  console.log( weights )
		  $('#container').highcharts(
		  {
			title: { text: "Chart for patient #" + data.user },
			xAxis: {categories: days},
			series: 
				[
				  {
					name: "weight",
				  	data: weights
				  }
				]
		  });	  
	   });
  </script>

  
</body>
</html>