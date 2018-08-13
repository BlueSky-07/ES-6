package BSFetch.tool;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class FormDataReader {
    InputStream raw;
    
    public FormDataReader() {
    }
    
    private FormDataReader(InputStream raw) {
        this.raw = raw;
    }
    
    public InputStream getData() {
        return raw;
    }
    
    public void setData(InputStream raw) {
        this.raw = raw;
    }
    
    private Map<String, String> getMap() {
        Scanner reader = new Scanner(raw, "utf8");
        String boundary = reader.nextLine();
        HashMap<String, String> res = new HashMap<>();
        while (reader.hasNext()) {
            String line = reader.nextLine();
            if (line.startsWith("Content-Disposition: form-data; name=")) {
                String key = line.substring("Content-Disposition: form-data; name=\"".length(), line.length() - 1);
                StringBuilder value = new StringBuilder();
                line = reader.nextLine();
                do {
                    if (!line.isEmpty()) {
                        value.append(line);
                    }
                    line = reader.nextLine();
                } while (!line.startsWith(boundary));
                res.put(key, value.toString());
            }
        }
        return res;
    }
    
    public static Map<String, String> getMap(InputStream raw) {
        return new FormDataReader(raw).getMap();
    }
}
