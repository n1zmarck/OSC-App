use rosc::{OscPacket, OscType};
use std::net::UdpSocket;
use tokio::sync::mpsc;

#[derive(Debug, Clone)]
pub struct IncomingOscSignal {
    pub address: String,
    pub value: f32,
    pub sender_port: u16,
}

pub struct OscReceiver {
    port: u16,
}

impl OscReceiver {
    pub fn new(port: u16) -> Self {
        Self { port }
    }

    pub fn start_listening(&self, tx: mpsc::Sender<IncomingOscSignal>) -> std::io::Result<()> {
        let addr = format!("0.0.0.0:{}", self.port);
        let socket = UdpSocket::bind(&addr)?;
        println!("[VRC-Flow Rust Engine] OSC Listener active on {}", addr);

        let mut buf = [0u8; 1536];

        loop {
            match socket.recv_from(&mut buf) {
                Ok((size, _src)) => {
                    if let Ok((_, packet)) = rosc::decoder::decode_complete(&buf[..size]) {
                        Self::process_packet(packet, self.port, &tx);
                    }
                }
                Err(e) => {
                    eprintln!("[OSC Receiver Error]: {}", e);
                    break;
                }
            }
        }

        Ok(())
    }

    fn process_packet(packet: OscPacket, port: u16, tx: &mpsc::Sender<IncomingOscSignal>) {
        match packet {
            OscPacket::Message(msg) => {
                let address = msg.addr;
                let value = match msg.args.first() {
                    Some(OscType::Float(f)) => *f,
                    Some(OscType::Int(i)) => *i as f32,
                    Some(OscType::Bool(b)) => if *b { 1.0 } else { 0.0 },
                    _ => 0.0,
                };

                let signal = IncomingOscSignal {
                    address,
                    value,
                    sender_port: port,
                };
                let _ = tx.blocking_send(signal);
            }
            OscPacket::Bundle(bundle) => {
                for p in bundle.content {
                    Self::process_packet(p, port, tx);
                }
            }
        }
    }
}
