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
public class PutAPI {
    private String storedText = "";
    
    @PutMapping ("/put/msg/default")
    public ResponseEntity PUT_default(String text) {
        System.out.print("brfore: " + storedText + "\t");
        System.out.print("received: " + text + "\t");
        if (storedText.isEmpty()) {
            storedText = text;
            System.out.println("now: " + storedText);
            if (storedText.isEmpty()) {
                return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
            } else {
                return new ResponseEntity(new HttpHeaders(), HttpStatus.CREATED); // 201
            }
        } else {
            if (text.equals(storedText)) {
                System.out.println("now: " + storedText);
                return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
            } else {
                storedText = text;
                System.out.println("now: " + storedText);
                return new ResponseEntity(new HttpHeaders(), HttpStatus.OK); // 200
            }
        }
    }
    
    @PutMapping ("/put/msg/json")
    public ResponseEntity PUT_json(@RequestBody Form form) {
        String text = form.getText();
        System.out.print("brfore: " + storedText + "\t");
        System.out.print("received: " + text + "\t");
        if (storedText.isEmpty()) {
            storedText = text;
            System.out.println("now: " + storedText);
            if (storedText.isEmpty()) {
                return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
            } else {
                return new ResponseEntity(new HttpHeaders(), HttpStatus.CREATED); // 201
            }
        } else {
            if (text.equals(storedText)) {
                System.out.println("now: " + storedText);
                return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
            } else {
                storedText = text;
                System.out.println("now: " + storedText);
                return new ResponseEntity(new HttpHeaders(), HttpStatus.OK); // 200
            }
        }
    }
    
    @PutMapping ("/put/msg/formdata")
    public ResponseEntity PUT_formdata(InputStream raw) {
        Map<String, String> data = FormDataReader.getMap(raw);
        String text = data.get("text");
        System.out.print("brfore: " + storedText + "\t");
        System.out.print("received: " + text + "\t");
        if (storedText.isEmpty()) {
            storedText = text;
            System.out.println("now: " + storedText);
            if (storedText.isEmpty()) {
                return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
            } else {
                return new ResponseEntity(new HttpHeaders(), HttpStatus.CREATED); // 201
            }
        } else {
            if (text.equals(storedText)) {
                System.out.println("now: " + storedText);
                return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
            } else {
                storedText = text;
                System.out.println("now: " + storedText);
                return new ResponseEntity(new HttpHeaders(), HttpStatus.OK); // 200
            }
        }
    }
    
    @PutMapping ("/put/file")
    public ResponseEntity PUT_file(MultipartFile file) {
        if (file.isEmpty()) {
            System.out.println("no valid file received!");
            return new ResponseEntity(new HttpHeaders(), HttpStatus.NO_CONTENT); // 204
        } else {
            System.out.println("received: " + file.getOriginalFilename() + ", size: " + file.getSize() + " bytes.");
            return new ResponseEntity(new HttpHeaders(), HttpStatus.OK); // 200
        }
    }
}
