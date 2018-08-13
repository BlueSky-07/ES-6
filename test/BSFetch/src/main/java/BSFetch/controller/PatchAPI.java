package BSFetch.controller;

import BSFetch.pojo.Form;
import BSFetch.tool.FormDataReader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Map;

@RestController
public class PatchAPI {
    private String storedText = "";
    
    @PatchMapping ("/patch/msg/default")
    public ResponseEntity PATCH_default(String text) {
        System.out.print("brfore: " + storedText + "\t");
        System.out.print("received: " + text + "\t");
        if (text.equals(storedText)) {
            System.out.println("now: " + storedText);
            return new ResponseEntity(new HttpHeaders(), HttpStatus.OK); // 200
        } else {
            storedText = text;
            System.out.println("now: " + storedText);
            return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
        }
    }
    
    @PatchMapping ("/patch/msg/json")
    public ResponseEntity PATCH_json(@RequestBody Form form) {
        String text = form.getText();
        System.out.print("brfore: " + storedText + "\t");
        System.out.print("received: " + text + "\t");
        if (text.equals(storedText)) {
            System.out.println("now: " + storedText);
            return new ResponseEntity(new HttpHeaders(), HttpStatus.OK); // 200
        } else {
            storedText = text;
            System.out.println("now: " + storedText);
            return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
        }
    }
    
    @PatchMapping ("/patch/msg/formdata")
    public ResponseEntity PATCH_formdata(InputStream raw) {
        Map<String, String> data = FormDataReader.getMap(raw);
        String text = data.get("text");
        System.out.print("brfore: " + storedText + "\t");
        System.out.print("received: " + text + "\t");
        if (text.equals(storedText)) {
            System.out.println("now: " + storedText);
            return new ResponseEntity(new HttpHeaders(), HttpStatus.OK); // 200
        } else {
            storedText = text;
            System.out.println("now: " + storedText);
            return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
        }
    }
    
    @PatchMapping ("/patch/file")
    public ResponseEntity PATCH_file(MultipartFile file) {
        if (file.isEmpty()) {
            System.out.println("no valid file received!");
            return new ResponseEntity(new HttpHeaders(), HttpStatus.OK); // 200
        } else {
            System.out.println("received: " + file.getOriginalFilename() + ", size: " + file.getSize() + " bytes.");
            return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
        }
    }
}
