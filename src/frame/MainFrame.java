package frame;

import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SpringLayout;
import javax.swing.border.EmptyBorder;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import javax.swing.JTextArea;

public class MainFrame extends JFrame {

	private JPanel contentPane;
	private JTextArea txtSel;
	private EventBus bus;
	private JTextField txtCombloidoniajdbcpersistor;
	private JLabel lblQueue;
	private JLabel lblSq;
	private JButton btnQuery;

	/**
	 * Create the frame.
	 */
	public MainFrame(final EventBus bus) {
		this.bus = bus;
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 491, 270);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		SpringLayout springLayout = new SpringLayout();
		contentPane.setLayout(springLayout);
		{
			txtSel = new JTextArea();
			txtSel.setLineWrap(true);
			txtSel.setRows(8);
			springLayout.putConstraint(SpringLayout.EAST, txtSel, 0, SpringLayout.EAST, contentPane);
			txtSel.setText("select user_code,user_name,user_pass from sy_user where rownum < 3");
			contentPane.add(txtSel);
			txtSel.setColumns(10);
		}
		{
			lblSq = new JLabel("sql:");
			springLayout.putConstraint(SpringLayout.WEST, txtSel, 6, SpringLayout.EAST, lblSq);
			springLayout.putConstraint(SpringLayout.EAST, lblSq, -401, SpringLayout.EAST, contentPane);
			springLayout.putConstraint(SpringLayout.WEST, lblSq, 10, SpringLayout.WEST, contentPane);
			contentPane.add(lblSq);
		}
		{
			btnQuery = new JButton("query");
			springLayout.putConstraint(SpringLayout.NORTH, btnQuery, 6, SpringLayout.SOUTH, txtSel);
			springLayout.putConstraint(SpringLayout.WEST, btnQuery, 372, SpringLayout.WEST, contentPane);
			springLayout.putConstraint(SpringLayout.SOUTH, btnQuery, 29, SpringLayout.SOUTH, txtSel);
			springLayout.putConstraint(SpringLayout.EAST, btnQuery, 0, SpringLayout.EAST, txtSel);
			btnQuery.addActionListener(new ActionListener() {
				public void actionPerformed(ActionEvent e) {
					String sql = txtSel.getText();
					String topic = txtCombloidoniajdbcpersistor.getText();
					JsonObject dbAction = new JsonObject();
					dbAction.putString("action", "select");
					dbAction.putString("stmt", sql);
					bus.publish(topic, dbAction);
					bus.send(topic, dbAction, new Handler<Message>() {
						@Override
						public void handle(Message arg0) {
							JsonObject body = (JsonObject) arg0.body();
							if (body.getString("status", "").equals("ok")) {
								JsonArray array = body.getArray("result");
								for (Object object : array) {
									System.out.println(object);
								}
							}
						}
					});
				}
			});
			contentPane.add(btnQuery);
		}
		{
			lblQueue = new JLabel("queue:");
			springLayout.putConstraint(SpringLayout.NORTH, lblQueue, 0, SpringLayout.NORTH, contentPane);
			springLayout.putConstraint(SpringLayout.NORTH, lblSq, 12, SpringLayout.SOUTH, lblQueue);
			springLayout.putConstraint(SpringLayout.WEST, lblQueue, 10, SpringLayout.WEST, contentPane);
			contentPane.add(lblQueue);
		}
		{
			txtCombloidoniajdbcpersistor = new JTextField();
			txtCombloidoniajdbcpersistor.setText("com.bloidonia.jdbcpersistor");
			springLayout.putConstraint(SpringLayout.NORTH, txtSel, 6, SpringLayout.SOUTH, txtCombloidoniajdbcpersistor);
			springLayout.putConstraint(SpringLayout.WEST, txtCombloidoniajdbcpersistor, 0, SpringLayout.WEST, txtSel);
			springLayout.putConstraint(SpringLayout.NORTH, txtCombloidoniajdbcpersistor, 0, SpringLayout.NORTH, contentPane);
			springLayout.putConstraint(SpringLayout.EAST, txtCombloidoniajdbcpersistor, 0, SpringLayout.EAST, contentPane);
			contentPane.add(txtCombloidoniajdbcpersistor);
			txtCombloidoniajdbcpersistor.setColumns(10);
		}
	}
}
