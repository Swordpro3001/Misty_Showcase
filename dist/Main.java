import javax.swing.JOptionPane;
import java.lang.Float;

import java.lang.Integer;

public class Main{
    public static void main(String[] args) {
        float hue = Float.parseFloat(JOptionPane.showInputDialog(null, "Hue"));
        float saturation = Float.parseFloat(JOptionPane.showInputDialog(null, "Saturation"));
        float brightness = Float.parseFloat(JOptionPane.showInputDialog(null, "Brightness"));
        System.out.println(hue+" "+ saturation+ " "+brightness);
    }
}