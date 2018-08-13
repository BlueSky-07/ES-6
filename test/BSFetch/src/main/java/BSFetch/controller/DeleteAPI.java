package BSFetch.controller;

import BSFetch.pojo.Form;
import BSFetch.tool.FormDataReader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@RestController
public class DeleteAPI {
    @DeleteMapping ("/delete/msg/default")
    public ResponseEntity DELETE_default(String text) {
        System.out.println("received: " + text);
        return new ResponseEntity(new HttpHeaders(), HttpStatus.ACCEPTED); // 202
    }
    
    @DeleteMapping ("/delete/msg/json")
    public Map<String, String> DELETE_json(@RequestBody Form form) {
        String text = form.getText();
        System.out.println("received: " + text);
        Map<String, String> res = new HashMap<>();
        res.put("result", "success");
        return res; // 200
    }
    
    @DeleteMapping ("/delete/msg/formdata")
    public ResponseEntity DELETE_formdata(InputStream raw) {
        Map<String, String> data = FormDataReader.getMap(raw);
        String text = data.get("text");
        System.out.println("received: " + text);
        return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
    }
}
