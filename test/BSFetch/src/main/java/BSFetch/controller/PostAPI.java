package BSFetch.controller;

import BSFetch.pojo.Form;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@RestController
public class PostAPI {
    @PostMapping ("/post/msg/default")
    public Map<String, Serializable> POST_default(String text) {
        HashMap<String, Serializable> result = new HashMap<>();
        if (text.isEmpty()) {
            result.put("status", "ERROR");
            result.put("result", "no valid message received!");
        } else {
            result.put("status", "SUCCESS");
            result.put("result", "received: " + text);
        }
        return result;
    }
    
    @PostMapping ("/post/msg/json")
    public Map<String, Serializable> POST_json(@RequestBody Form form) {
        String text = form.getText();
        HashMap<String, Serializable> result = new HashMap<>();
        if (text.isEmpty()) {
            result.put("status", "ERROR");
            result.put("result", "no valid message received!");
        } else {
            result.put("status", "SUCCESS");
            result.put("result", "received: " + text);
        }
        return result;
    }
    
    @PostMapping ("/post/msg/formdata")
    public Map<String, Serializable> POST_formdata(String text) {
        HashMap<String, Serializable> result = new HashMap<>();
        if (text.isEmpty()) {
            result.put("status", "ERROR");
            result.put("result", "no valid message received!");
        } else {
            result.put("status", "SUCCESS");
            result.put("result", "received: " + text);
        }
        return result;
    }
    
    @PostMapping ("/post/file")
    public Map<String, Serializable> POST_file(MultipartFile file) {
        HashMap<String, Serializable> result = new HashMap<>();
        if (file.isEmpty()) {
            result.put("status", "ERROR");
            result.put("result", "no valid file received!");
        } else {
            result.put("status", "SUCCESS");
            result.put("result", "received: " + file.getOriginalFilename() + ", size: " + file.getSize() + " bytes.");
        }
        return result;
    }
}
