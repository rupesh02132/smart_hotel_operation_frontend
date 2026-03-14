import React, { useEffect } from "react";
import { Avatar, Card, CardContent, Typography, Divider, Box, Chip, Button, IconButton } from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../state/auth/Action';
import { 
  Hotel, 
  Stars, 
  History, 
  RoomService, 
  Settings, 
  NotificationsActive,
  VpnKey,
  DeviceThermostat,
  ShieldMoon,
  AutoFixHigh
} from '@mui/icons-material';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const { jwt, user: userData } = auth;

  // Flatten nested user object safely
  const profile = userData?.user || userData;

  useEffect(() => {
    if (jwt && !profile) {
      dispatch(getUser(jwt));
    }
  }, [dispatch, profile, jwt]);

  if (!profile) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
      <div className="text-blue-500 font-mono animate-pulse">SYSTEM_SYNCING...</div>
    </div>
  );

  const joinedDate = new Date(profile.createdAt).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-4 selection:bg-blue-500/30">
      <Container>
        <Card className="max-w-6xl mx-auto overflow-hidden border-none shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] rounded-[3rem] bg-[#1e293b]/50 backdrop-blur-2xl border border-white/5">
          <CardContent className="p-0">
            <Row className="g-0">
              
              {/* LEFT: GUEST IDENTITY (Dark Luxury) */}
              <Col lg={4} className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-12 text-white flex flex-col items-center border-r border-white/5">
                <div className="relative mb-8">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-30 animate-pulse"></div>
                  <Avatar
                    sx={{ width: 150, height: 150, bgcolor: '#0f172a', fontSize: '3.5rem' }}
                    className="relative border-4 border-white/10 shadow-2xl"
                  >
                    {profile.firstname?.charAt(0)}
                  </Avatar>
                  <div className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full border-4 border-[#0f172a]">
                    <Stars style={{ fontSize: 20 }} />
                  </div>
                </div>

                <Typography variant="h4" className="font-black mb-1 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                  {profile.firstname}
                </Typography>
                <Typography className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-8">
                  Platinum Resident
                </Typography>

                <div className="w-full space-y-4">
                  <Button fullWidth variant="contained" startIcon={<VpnKey />} className="bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl normal-case font-bold shadow-lg shadow-blue-900/40">
                    Active Room Key
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<ShieldMoon />} className="border-white/10 text-slate-300 py-4 rounded-2xl hover:bg-white/5 normal-case font-medium">
                    Privacy Settings
                  </Button>
                </div>

                <div className="mt-auto pt-12 w-full">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                    <span>Loyalty Status</span>
                    <span className="text-blue-400">88% to Diamond</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[88%]" />
                  </div>
                </div>
              </Col>

              {/* RIGHT: SMART OPS DASHBOARD */}
              <Col lg={8} className="p-10 md:p-16 bg-white shadow-inner">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <Typography variant="h3" className="text-slate-900 font-black tracking-tighter">
                      Operations
                    </Typography>
                    <Typography className="text-slate-500 font-medium">
                      Manage your smart environment in real-time.
                    </Typography>
                  </div>
                  <IconButton className="bg-slate-100 rounded-2xl p-4">
                    <NotificationsActive className="text-slate-900" />
                  </IconButton>
                </div>

                {/* SMART METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {[
                    { label: 'Total Nights', val: '24', icon: <Hotel />, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Room Service', val: '04', icon: <RoomService />, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Points', val: '12.5k', icon: <AutoFixHigh />, color: 'text-amber-600', bg: 'bg-amber-50' }
                  ].map((stat, i) => (
                    <Box key={i} className={`${stat.bg} p-6 rounded-[2rem] border border-transparent hover:border-slate-200 transition-all`}>
                      <div className={`${stat.color} mb-3`}>{stat.icon}</div>
                      <Typography className="text-3xl font-black text-slate-900">{stat.val}</Typography>
                      <Typography className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</Typography>
                    </Box>
                  ))}
                </div>

                {/* ACTIVE ROOM STATUS (The "Smart" part) */}
                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
                    <Typography className="font-bold text-slate-800 uppercase text-xs tracking-widest">Live Room Status • 402</Typography>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
                      <div className="flex items-center gap-4">
                        <DeviceThermostat className="text-blue-400" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Climate</p>
                          <p className="text-lg font-bold italic text-blue-50">21°C Optimized</p>
                        </div>
                      </div>
                      <Settings fontSize="small" className="text-slate-600" />
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <History className="text-slate-400" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Check-out</p>
                          <p className="text-lg font-bold text-slate-800">12:00 PM Tomorrow</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <Divider className="mb-8" />

                {/* USER DATA */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Guest Email</Typography>
                    <Typography className="text-slate-700 font-semibold">{profile.email}</Typography>
                  </div>
                  <div>
                    <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Member Since</Typography>
                    <Typography className="text-slate-700 font-semibold">{joinedDate}</Typography>
                  </div>
                </div>
              </Col>

            </Row>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile;