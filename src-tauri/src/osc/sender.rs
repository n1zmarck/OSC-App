use rosc::{encoder, OscMessage, OscPacket, OscType};
use std::net::UdpSocket;

pub struct OscSender {
    socket: UdpSocket,
}

impl OscSender {
    pub fn new() -> Result<Self, std::io::Error> {
        let socket = UdpSocket::bind("0.0.0.0:0")?;
        Ok(Self { socket })
    }

    pub fn send_float(&self, target_ip: &str, target_port: u16, address: &str, value: f32) -> Result<(), Box<dyn std::error::Error>> {
        let msg = OscMessage {
            addr: address.to_string(),
            args: vec![OscType::Float(value)],
        };
        let packet = OscPacket::Message(msg);
        let buf = encoder::encode(&packet)?;

        let dest = format!("{}:{}", target_ip, target_port);
        self.socket.send_to(&buf, &dest)?;
        Ok(())
    }

    pub fn send_bool(&self, target_ip: &str, target_port: u16, address: &str, value: bool) -> Result<(), Box<dyn std::error::Error>> {
        let msg = OscMessage {
            addr: address.to_string(),
            args: vec![OscType::Bool(value)],
        };
        let packet = OscPacket::Message(msg);
        let buf = encoder::encode(&packet)?;

        let dest = format!("{}:{}", target_ip, target_port);
        self.socket.send_to(&buf, &dest)?;
        Ok(())
    }
}
