import type {
  Vehicle, Driver, Job, Trip, Incident, ComplianceRecord,
  DispatchRecommendation, DailyMetric
} from '../types'

// ─── Fleet: 48 vehicles ──────────────────────────────────────────────────────
// Available: 15 | Assigned: 8 | On Trip: 18 | Maintenance: 5 | Offline: 2

export const vehicles: Vehicle[] = [
  // ── On Trip (18) ───────────────────────────────────────────────
  { id:'V001', regNumber:'MH12AB1234', type:'heavy-truck', make:'Tata', model:'Prima 4928.S', year:2022, status:'on-trip', currentDriverId:'D001', currentJobId:'J001', location:{lat:19.08,lng:72.88,city:'Mumbai'}, capacityKg:25000, fuelType:'diesel', lastServiceDate:'2026-09-01', nextServiceDate:'2026-12-01', mileageKm:88420, complianceStatus:'valid', depot:'Mumbai North' },
  { id:'V002', regNumber:'MH12AB2345', type:'heavy-truck', make:'Ashok Leyland', model:'U-Truck 2518', year:2021, status:'on-trip', currentDriverId:'D002', currentJobId:'J002', location:{lat:18.52,lng:73.86,city:'Pune'}, capacityKg:18000, fuelType:'diesel', lastServiceDate:'2026-08-15', nextServiceDate:'2026-11-15', mileageKm:112000, complianceStatus:'valid', depot:'Pune' },
  { id:'V003', regNumber:'MH14CD3456', type:'medium-truck', make:'Eicher', model:'Pro 2095', year:2023, status:'on-trip', currentDriverId:'D003', currentJobId:'J003', location:{lat:19.22,lng:72.98,city:'Thane'}, capacityKg:9500, fuelType:'diesel', lastServiceDate:'2026-09-20', nextServiceDate:'2027-03-20', mileageKm:42100, complianceStatus:'valid', depot:'Mumbai North' },
  { id:'V004', regNumber:'GJ01EF4567', type:'heavy-truck', make:'Tata', model:'LPT 3118', year:2020, status:'on-trip', currentDriverId:'D004', currentJobId:'J004', location:{lat:22.30,lng:70.80,city:'Rajkot'}, capacityKg:31000, fuelType:'diesel', lastServiceDate:'2026-07-10', nextServiceDate:'2026-10-10', mileageKm:189500, complianceStatus:'expiring-soon', depot:'Ahmedabad' },
  { id:'V005', regNumber:'GJ01GH5678', type:'tanker', make:'Bharat Benz', model:'1623 T', year:2021, status:'on-trip', currentDriverId:'D005', currentJobId:'J005', location:{lat:23.03,lng:72.58,city:'Ahmedabad'}, capacityKg:16000, fuelType:'diesel', lastServiceDate:'2026-09-05', nextServiceDate:'2026-12-05', mileageKm:73200, complianceStatus:'valid', depot:'Ahmedabad' },
  { id:'V006', regNumber:'RJ14IJ6789', type:'heavy-truck', make:'Tata', model:'Prima 3128', year:2022, status:'on-trip', currentDriverId:'D006', currentJobId:'J006', location:{lat:26.92,lng:75.78,city:'Jaipur'}, capacityKg:28000, fuelType:'diesel', lastServiceDate:'2026-08-22', nextServiceDate:'2026-11-22', mileageKm:68900, complianceStatus:'valid', depot:'Jaipur' },
  { id:'V007', regNumber:'DL01KL7890', type:'light-truck', make:'Mahindra', model:'Blazo X 28', year:2023, status:'on-trip', currentDriverId:'D007', currentJobId:'J007', location:{lat:28.63,lng:77.21,city:'Delhi'}, capacityKg:28000, fuelType:'diesel', lastServiceDate:'2026-09-18', nextServiceDate:'2027-03-18', mileageKm:31400, complianceStatus:'valid', depot:'Delhi' },
  { id:'V008', regNumber:'DL08MN8901', type:'van', make:'Force', model:'Traveller 3350', year:2022, status:'on-trip', currentDriverId:'D008', currentJobId:'J008', location:{lat:28.70,lng:77.10,city:'Gurgaon'}, capacityKg:3000, fuelType:'cng', lastServiceDate:'2026-09-01', nextServiceDate:'2026-12-01', mileageKm:55700, complianceStatus:'valid', depot:'Delhi' },
  { id:'V009', regNumber:'KA01OP9012', type:'heavy-truck', make:'Volvo', model:'FM 420', year:2021, status:'on-trip', currentDriverId:'D009', currentJobId:'J009', location:{lat:12.97,lng:77.59,city:'Bengaluru'}, capacityKg:24000, fuelType:'diesel', lastServiceDate:'2026-08-01', nextServiceDate:'2026-11-01', mileageKm:134200, complianceStatus:'valid', depot:'Bengaluru' },
  { id:'V010', regNumber:'KA05QR0123', type:'medium-truck', make:'Eicher', model:'Pro 3015', year:2022, status:'on-trip', currentDriverId:'D010', currentJobId:'J010', location:{lat:12.55,lng:77.32,city:'Mysuru'}, capacityKg:12000, fuelType:'diesel', lastServiceDate:'2026-09-12', nextServiceDate:'2026-12-12', mileageKm:61800, complianceStatus:'valid', depot:'Bengaluru' },
  { id:'V011', regNumber:'TN01ST1234', type:'heavy-truck', make:'Ashok Leyland', model:'U-Truck 3518', year:2020, status:'on-trip', currentDriverId:'D011', currentJobId:'J011', location:{lat:13.08,lng:80.27,city:'Chennai'}, capacityKg:35000, fuelType:'diesel', lastServiceDate:'2026-07-15', nextServiceDate:'2026-10-15', mileageKm:215000, complianceStatus:'expiring-soon', depot:'Chennai' },
  { id:'V012', regNumber:'TN22UV2345', type:'tanker', make:'Tata', model:'LPT 2516', year:2021, status:'on-trip', currentDriverId:'D012', currentJobId:'J012', location:{lat:12.91,lng:79.13,city:'Vellore'}, capacityKg:16000, fuelType:'diesel', lastServiceDate:'2026-08-20', nextServiceDate:'2026-11-20', mileageKm:88900, complianceStatus:'valid', depot:'Chennai' },
  { id:'V013', regNumber:'TS01WX3456', type:'heavy-truck', make:'Mercedes-Benz', model:'Actros 2546', year:2022, status:'on-trip', currentDriverId:'D013', currentJobId:'J013', location:{lat:17.44,lng:78.38,city:'Hyderabad'}, capacityKg:26000, fuelType:'diesel', lastServiceDate:'2026-09-08', nextServiceDate:'2027-03-08', mileageKm:49200, complianceStatus:'valid', depot:'Hyderabad' },
  { id:'V014', regNumber:'UP32YZ4567', type:'medium-truck', make:'Tata', model:'Ultra 1412', year:2022, status:'on-trip', currentDriverId:'D014', currentJobId:'J014', location:{lat:26.85,lng:80.94,city:'Lucknow'}, capacityKg:14000, fuelType:'diesel', lastServiceDate:'2026-09-02', nextServiceDate:'2026-12-02', mileageKm:55100, complianceStatus:'valid', depot:'Lucknow' },
  { id:'V015', regNumber:'WB01AB5678', type:'heavy-truck', make:'Tata', model:'Prima 4928.S', year:2021, status:'on-trip', currentDriverId:'D015', currentJobId:'J015', location:{lat:22.57,lng:88.36,city:'Kolkata'}, capacityKg:25000, fuelType:'diesel', lastServiceDate:'2026-08-18', nextServiceDate:'2026-11-18', mileageKm:107600, complianceStatus:'valid', depot:'Kolkata' },
  { id:'V016', regNumber:'MH04CD6789', type:'light-truck', make:'Mahindra', model:'Furio 7', year:2023, status:'on-trip', currentDriverId:'D016', currentJobId:'J016', location:{lat:18.66,lng:73.79,city:'Pimpri-Chinchwad'}, capacityKg:7000, fuelType:'diesel', lastServiceDate:'2026-09-25', nextServiceDate:'2027-03-25', mileageKm:18700, complianceStatus:'valid', depot:'Pune' },
  { id:'V017', regNumber:'GJ09EF7890', type:'heavy-truck', make:'Bharat Benz', model:'3523', year:2020, status:'on-trip', currentDriverId:'D017', currentJobId:'J017', location:{lat:21.19,lng:72.83,city:'Surat'}, capacityKg:35000, fuelType:'diesel', lastServiceDate:'2026-07-25', nextServiceDate:'2026-10-25', mileageKm:172000, complianceStatus:'expiring-soon', depot:'Ahmedabad' },
  { id:'V018', regNumber:'HR55GH8901', type:'medium-truck', make:'Eicher', model:'Pro 2114', year:2022, status:'on-trip', currentDriverId:'D018', currentJobId:'J018', location:{lat:28.45,lng:77.03,city:'Faridabad'}, capacityKg:11000, fuelType:'diesel', lastServiceDate:'2026-09-15', nextServiceDate:'2026-12-15', mileageKm:62400, complianceStatus:'valid', depot:'Delhi' },

  // ── Assigned (8) ───────────────────────────────────────────────
  { id:'V019', regNumber:'MH02IJ9012', type:'van', make:'Tata', model:'Ace Gold', year:2023, status:'assigned', currentDriverId:'D019', currentJobId:'J019', location:{lat:19.07,lng:72.83,city:'Mumbai'}, capacityKg:750, fuelType:'petrol', lastServiceDate:'2026-09-10', nextServiceDate:'2027-03-10', mileageKm:12400, complianceStatus:'valid', depot:'Mumbai South' },
  { id:'V020', regNumber:'MH01KL0123', type:'heavy-truck', make:'Tata', model:'Prima 5530.S', year:2022, status:'assigned', currentDriverId:'D020', currentJobId:'J020', location:{lat:19.07,lng:72.83,city:'Mumbai'}, capacityKg:55000, fuelType:'diesel', lastServiceDate:'2026-08-28', nextServiceDate:'2026-11-28', mileageKm:78900, complianceStatus:'valid', depot:'Mumbai South' },
  { id:'V021', regNumber:'KA03MN1234', type:'medium-truck', make:'Eicher', model:'Pro 2114X', year:2021, status:'assigned', currentDriverId:'D021', currentJobId:'J021', location:{lat:12.97,lng:77.59,city:'Bengaluru'}, capacityKg:11000, fuelType:'diesel', lastServiceDate:'2026-08-10', nextServiceDate:'2026-11-10', mileageKm:94500, complianceStatus:'valid', depot:'Bengaluru' },
  { id:'V022', regNumber:'DL10OP2345', type:'heavy-truck', make:'Volvo', model:'FH 500', year:2022, status:'assigned', currentDriverId:'D022', currentJobId:'J022', location:{lat:28.63,lng:77.21,city:'Delhi'}, capacityKg:26000, fuelType:'diesel', lastServiceDate:'2026-09-05', nextServiceDate:'2026-12-05', mileageKm:63200, complianceStatus:'valid', depot:'Delhi' },
  { id:'V023', regNumber:'RJ01QR3456', type:'light-truck', make:'Mahindra', model:'Furio 11', year:2023, status:'assigned', currentDriverId:'D023', currentJobId:'J023', location:{lat:26.92,lng:75.78,city:'Jaipur'}, capacityKg:11000, fuelType:'diesel', lastServiceDate:'2026-09-22', nextServiceDate:'2027-03-22', mileageKm:22100, complianceStatus:'valid', depot:'Jaipur' },
  { id:'V024', regNumber:'TN09ST4567', type:'medium-truck', make:'Ashok Leyland', model:'Boss 1415', year:2021, status:'assigned', currentDriverId:'D024', currentJobId:'J024', location:{lat:13.08,lng:80.27,city:'Chennai'}, capacityKg:15000, fuelType:'diesel', lastServiceDate:'2026-08-25', nextServiceDate:'2026-11-25', mileageKm:102300, complianceStatus:'valid', depot:'Chennai' },
  { id:'V025', regNumber:'TS09UV5678', type:'heavy-truck', make:'Tata', model:'Prima 3128.S', year:2022, status:'assigned', currentDriverId:'D025', currentJobId:'J025', location:{lat:17.44,lng:78.38,city:'Hyderabad'}, capacityKg:31000, fuelType:'diesel', lastServiceDate:'2026-09-18', nextServiceDate:'2027-03-18', mileageKm:41800, complianceStatus:'valid', depot:'Hyderabad' },
  { id:'V026', regNumber:'MH43WX6789', type:'van', make:'Force', model:'T1 5250', year:2022, status:'assigned', currentDriverId:'D026', currentJobId:'J026', location:{lat:19.12,lng:74.74,city:'Nashik'}, capacityKg:2500, fuelType:'cng', lastServiceDate:'2026-09-08', nextServiceDate:'2026-12-08', mileageKm:47600, complianceStatus:'valid', depot:'Nashik' },

  // ── Available (15) ─────────────────────────────────────────────
  { id:'V027', regNumber:'MH05YZ7890', type:'medium-truck', make:'Eicher', model:'Pro 2095X', year:2023, status:'available', location:{lat:19.07,lng:72.83,city:'Mumbai'}, capacityKg:9500, fuelType:'diesel', lastServiceDate:'2026-09-28', nextServiceDate:'2027-03-28', mileageKm:9800, complianceStatus:'valid', depot:'Mumbai North' },
  { id:'V028', regNumber:'MH06AB8901', type:'heavy-truck', make:'Tata', model:'Prima 4928.S', year:2021, status:'available', location:{lat:19.07,lng:72.83,city:'Mumbai'}, capacityKg:25000, fuelType:'diesel', lastServiceDate:'2026-09-15', nextServiceDate:'2026-12-15', mileageKm:118400, complianceStatus:'valid', depot:'Mumbai South' },
  { id:'V029', regNumber:'GJ06CD9012', type:'heavy-truck', make:'Ashok Leyland', model:'U-Truck 4923', year:2022, status:'available', location:{lat:23.03,lng:72.58,city:'Ahmedabad'}, capacityKg:49000, fuelType:'diesel', lastServiceDate:'2026-09-20', nextServiceDate:'2027-03-20', mileageKm:38700, complianceStatus:'valid', depot:'Ahmedabad' },
  { id:'V030', regNumber:'KA20EF0123', type:'medium-truck', make:'Eicher', model:'Pro 3015X', year:2023, status:'available', location:{lat:12.97,lng:77.59,city:'Bengaluru'}, capacityKg:12000, fuelType:'diesel', lastServiceDate:'2026-09-25', nextServiceDate:'2027-03-25', mileageKm:14200, complianceStatus:'valid', depot:'Bengaluru' },
  { id:'V031', regNumber:'DL04GH1234', type:'van', make:'Tata', model:'Ace Mega', year:2023, status:'available', location:{lat:28.63,lng:77.21,city:'Delhi'}, capacityKg:1000, fuelType:'electric', lastServiceDate:'2026-09-20', nextServiceDate:'2027-03-20', mileageKm:7400, complianceStatus:'valid', depot:'Delhi' },
  { id:'V032', regNumber:'TN04IJ2345', type:'light-truck', make:'Mahindra', model:'Blazo 21', year:2022, status:'available', location:{lat:13.08,lng:80.27,city:'Chennai'}, capacityKg:21000, fuelType:'diesel', lastServiceDate:'2026-09-12', nextServiceDate:'2026-12-12', mileageKm:72800, complianceStatus:'valid', depot:'Chennai' },
  { id:'V033', regNumber:'TS05KL3456', type:'heavy-truck', make:'Volvo', model:'FM 440', year:2021, status:'available', location:{lat:17.44,lng:78.38,city:'Hyderabad'}, capacityKg:24000, fuelType:'diesel', lastServiceDate:'2026-08-30', nextServiceDate:'2026-11-30', mileageKm:96100, complianceStatus:'valid', depot:'Hyderabad' },
  { id:'V034', regNumber:'RJ14MN4567', type:'medium-truck', make:'Eicher', model:'Pro 2114', year:2022, status:'available', location:{lat:26.92,lng:75.78,city:'Jaipur'}, capacityKg:11000, fuelType:'diesel', lastServiceDate:'2026-09-08', nextServiceDate:'2026-12-08', mileageKm:55400, complianceStatus:'valid', depot:'Jaipur' },
  { id:'V035', regNumber:'UP78OP5678', type:'heavy-truck', make:'Tata', model:'LPT 3118', year:2020, status:'available', location:{lat:26.85,lng:80.94,city:'Lucknow'}, capacityKg:31000, fuelType:'diesel', lastServiceDate:'2026-07-30', nextServiceDate:'2026-10-30', mileageKm:167000, complianceStatus:'expiring-soon', depot:'Lucknow' },
  { id:'V036', regNumber:'WB02QR6789', type:'medium-truck', make:'Eicher', model:'Pro 2095', year:2022, status:'available', location:{lat:22.57,lng:88.36,city:'Kolkata'}, capacityKg:9500, fuelType:'diesel', lastServiceDate:'2026-09-18', nextServiceDate:'2026-12-18', mileageKm:48200, complianceStatus:'valid', depot:'Kolkata' },
  { id:'V037', regNumber:'MH47ST7890', type:'tanker', make:'Bharat Benz', model:'2523 T', year:2021, status:'available', location:{lat:19.12,lng:74.74,city:'Nashik'}, capacityKg:16000, fuelType:'diesel', lastServiceDate:'2026-09-05', nextServiceDate:'2026-12-05', mileageKm:82700, complianceStatus:'valid', depot:'Nashik' },
  { id:'V038', regNumber:'MP09UV8901', type:'heavy-truck', make:'Tata', model:'Prima 4928.S', year:2022, status:'available', location:{lat:23.18,lng:77.40,city:'Bhopal'}, capacityKg:25000, fuelType:'diesel', lastServiceDate:'2026-09-15', nextServiceDate:'2027-03-15', mileageKm:44100, complianceStatus:'valid', depot:'Bhopal' },
  { id:'V039', regNumber:'PB10WX9012', type:'medium-truck', make:'Eicher', model:'Pro 3015', year:2022, status:'available', location:{lat:30.73,lng:76.79,city:'Chandigarh'}, capacityKg:12000, fuelType:'diesel', lastServiceDate:'2026-09-10', nextServiceDate:'2026-12-10', mileageKm:58900, complianceStatus:'valid', depot:'Chandigarh' },
  { id:'V040', regNumber:'AP29YZ0123', type:'heavy-truck', make:'Tata', model:'LPT 3118', year:2021, status:'available', location:{lat:17.69,lng:83.22,city:'Visakhapatnam'}, capacityKg:31000, fuelType:'diesel', lastServiceDate:'2026-08-28', nextServiceDate:'2026-11-28', mileageKm:114700, complianceStatus:'valid', depot:'Visakhapatnam' },
  { id:'V041', regNumber:'OR02AB1234', type:'van', make:'Force', model:'Traveller 3350', year:2023, status:'available', location:{lat:20.29,lng:85.82,city:'Bhubaneswar'}, capacityKg:3000, fuelType:'diesel', lastServiceDate:'2026-09-28', nextServiceDate:'2027-03-28', mileageKm:8400, complianceStatus:'valid', depot:'Bhubaneswar' },

  // ── Maintenance (5) ────────────────────────────────────────────
  { id:'V042', regNumber:'MH01CD2345', type:'heavy-truck', make:'Tata', model:'Prima 4928.S', year:2019, status:'maintenance', location:{lat:19.07,lng:72.83,city:'Mumbai'}, capacityKg:25000, fuelType:'diesel', lastServiceDate:'2026-09-29', nextServiceDate:'2026-10-14', mileageKm:245000, complianceStatus:'valid', depot:'Mumbai North' },
  { id:'V043', regNumber:'KA08EF3456', type:'medium-truck', make:'Eicher', model:'Pro 2114', year:2020, status:'maintenance', location:{lat:12.97,lng:77.59,city:'Bengaluru'}, capacityKg:11000, fuelType:'diesel', lastServiceDate:'2026-09-29', nextServiceDate:'2026-10-12', mileageKm:178000, complianceStatus:'valid', depot:'Bengaluru' },
  { id:'V044', regNumber:'DL07GH4567', type:'heavy-truck', make:'Ashok Leyland', model:'U-Truck 2518', year:2019, status:'maintenance', location:{lat:28.63,lng:77.21,city:'Delhi'}, capacityKg:18000, fuelType:'diesel', lastServiceDate:'2026-09-28', nextServiceDate:'2026-10-10', mileageKm:312000, complianceStatus:'expired', depot:'Delhi' },
  { id:'V045', regNumber:'TN18IJ5678', type:'heavy-truck', make:'Tata', model:'LPT 3118', year:2020, status:'maintenance', location:{lat:13.08,lng:80.27,city:'Chennai'}, capacityKg:31000, fuelType:'diesel', lastServiceDate:'2026-09-25', nextServiceDate:'2026-10-09', mileageKm:198000, complianceStatus:'valid', depot:'Chennai' },
  { id:'V046', regNumber:'GJ18KL6789', type:'tanker', make:'Bharat Benz', model:'1623 T', year:2021, status:'maintenance', location:{lat:23.03,lng:72.58,city:'Ahmedabad'}, capacityKg:16000, fuelType:'diesel', lastServiceDate:'2026-09-27', nextServiceDate:'2026-10-11', mileageKm:132000, complianceStatus:'valid', depot:'Ahmedabad' },

  // ── Offline (2) ────────────────────────────────────────────────
  { id:'V047', regNumber:'RJ01MN7890', type:'heavy-truck', make:'Tata', model:'Prima 3128', year:2018, status:'offline', location:{lat:26.92,lng:75.78,city:'Jaipur'}, capacityKg:28000, fuelType:'diesel', lastServiceDate:'2026-06-01', nextServiceDate:'2026-07-01', mileageKm:398000, complianceStatus:'expired', depot:'Jaipur' },
  { id:'V048', regNumber:'UP15OP8901', type:'medium-truck', make:'Eicher', model:'Pro 2095', year:2017, status:'offline', location:{lat:26.85,lng:80.94,city:'Lucknow'}, capacityKg:9500, fuelType:'diesel', lastServiceDate:'2026-05-15', nextServiceDate:'2026-06-15', mileageKm:441000, complianceStatus:'expired', depot:'Lucknow' },
]

// ─── Drivers: 35 ─────────────────────────────────────────────────────────────
// On Trip: 18 | Assigned (ready): 8 | Available: 6 | Off Duty: 2 | On Leave: 1

export const drivers: Driver[] = [
  // On Trip (18)
  { id:'D001', name:'Ramesh Kumar', licenseNumber:'MH0120190012345', licenseExpiry:'2028-03-15', status:'on-trip', currentVehicleId:'V001', currentJobId:'J001', riskScore:'low', hoursThisWeek:34, phone:'+91-98765-43210', joinDate:'2019-06-01', violations:0, depot:'Mumbai North', rating:4.8 },
  { id:'D002', name:'Suresh Patil', licenseNumber:'MH1420180023456', licenseExpiry:'2027-08-22', status:'on-trip', currentVehicleId:'V002', currentJobId:'J002', riskScore:'low', hoursThisWeek:38, phone:'+91-98765-43211', joinDate:'2018-11-15', violations:1, depot:'Pune', rating:4.6 },
  { id:'D003', name:'Ajay Thakur', licenseNumber:'MH0420210034567', licenseExpiry:'2029-01-10', status:'on-trip', currentVehicleId:'V003', currentJobId:'J003', riskScore:'low', hoursThisWeek:28, phone:'+91-98765-43212', joinDate:'2021-03-20', violations:0, depot:'Mumbai North', rating:4.9 },
  { id:'D004', name:'Vijay Yadav', licenseNumber:'GJ0120170045678', licenseExpiry:'2025-11-30', status:'on-trip', currentVehicleId:'V004', currentJobId:'J004', riskScore:'medium', hoursThisWeek:42, phone:'+91-98765-43213', joinDate:'2017-08-10', violations:3, depot:'Ahmedabad', rating:3.9 },
  { id:'D005', name:'Mahesh Patel', licenseNumber:'GJ0120200056789', licenseExpiry:'2028-05-18', status:'on-trip', currentVehicleId:'V005', currentJobId:'J005', riskScore:'low', hoursThisWeek:36, phone:'+91-98765-43214', joinDate:'2020-01-12', violations:0, depot:'Ahmedabad', rating:4.7 },
  { id:'D006', name:'Arun Sharma', licenseNumber:'RJ1420190067890', licenseExpiry:'2027-12-01', status:'on-trip', currentVehicleId:'V006', currentJobId:'J006', riskScore:'low', hoursThisWeek:30, phone:'+91-98765-43215', joinDate:'2019-09-05', violations:1, depot:'Jaipur', rating:4.5 },
  { id:'D007', name:'Deepak Singh', licenseNumber:'DL0120210078901', licenseExpiry:'2029-06-14', status:'on-trip', currentVehicleId:'V007', currentJobId:'J007', riskScore:'low', hoursThisWeek:26, phone:'+91-98765-43216', joinDate:'2021-07-18', violations:0, depot:'Delhi', rating:4.8 },
  { id:'D008', name:'Rohit Verma', licenseNumber:'DL0820200089012', licenseExpiry:'2028-02-28', status:'on-trip', currentVehicleId:'V008', currentJobId:'J008', riskScore:'medium', hoursThisWeek:44, phone:'+91-98765-43217', joinDate:'2020-04-22', violations:2, depot:'Delhi', rating:4.1 },
  { id:'D009', name:'Sanjay Nair', licenseNumber:'KA0120180090123', licenseExpiry:'2026-09-20', status:'on-trip', currentVehicleId:'V009', currentJobId:'J009', riskScore:'low', hoursThisWeek:32, phone:'+91-98765-43218', joinDate:'2018-02-14', violations:0, depot:'Bengaluru', rating:4.7 },
  { id:'D010', name:'Venkat Reddy', licenseNumber:'KA0520210001234', licenseExpiry:'2029-07-05', status:'on-trip', currentVehicleId:'V010', currentJobId:'J010', riskScore:'low', hoursThisWeek:28, phone:'+91-98765-43219', joinDate:'2021-10-30', violations:0, depot:'Bengaluru', rating:4.9 },
  { id:'D011', name:'Murugan Selvam', licenseNumber:'TN0120160012345', licenseExpiry:'2024-12-31', status:'on-trip', currentVehicleId:'V011', currentJobId:'J011', riskScore:'high', hoursThisWeek:46, phone:'+91-98765-43220', joinDate:'2016-05-08', violations:5, depot:'Chennai', rating:3.4 },
  { id:'D012', name:'Karthik Rajan', licenseNumber:'TN2220190023456', licenseExpiry:'2027-04-15', status:'on-trip', currentVehicleId:'V012', currentJobId:'J012', riskScore:'low', hoursThisWeek:34, phone:'+91-98765-43221', joinDate:'2019-11-20', violations:1, depot:'Chennai', rating:4.6 },
  { id:'D013', name:'Prakash Reddy', licenseNumber:'TS0120210034567', licenseExpiry:'2029-03-22', status:'on-trip', currentVehicleId:'V013', currentJobId:'J013', riskScore:'low', hoursThisWeek:30, phone:'+91-98765-43222', joinDate:'2021-01-15', violations:0, depot:'Hyderabad', rating:4.8 },
  { id:'D014', name:'Rakesh Pandey', licenseNumber:'UP3220200045678', licenseExpiry:'2028-09-10', status:'on-trip', currentVehicleId:'V014', currentJobId:'J014', riskScore:'low', hoursThisWeek:36, phone:'+91-98765-43223', joinDate:'2020-07-08', violations:0, depot:'Lucknow', rating:4.7 },
  { id:'D015', name:'Subir Das', licenseNumber:'WB0120180056789', licenseExpiry:'2026-11-30', status:'on-trip', currentVehicleId:'V015', currentJobId:'J015', riskScore:'medium', hoursThisWeek:40, phone:'+91-98765-43224', joinDate:'2018-08-25', violations:2, depot:'Kolkata', rating:4.2 },
  { id:'D016', name:'Ganesh Kamble', licenseNumber:'MH0420220067890', licenseExpiry:'2030-02-14', status:'on-trip', currentVehicleId:'V016', currentJobId:'J016', riskScore:'low', hoursThisWeek:24, phone:'+91-98765-43225', joinDate:'2022-04-10', violations:0, depot:'Pune', rating:4.9 },
  { id:'D017', name:'Harish Patel', licenseNumber:'GJ0920190078901', licenseExpiry:'2027-08-18', status:'on-trip', currentVehicleId:'V017', currentJobId:'J017', riskScore:'medium', hoursThisWeek:42, phone:'+91-98765-43226', joinDate:'2019-03-25', violations:3, depot:'Ahmedabad', rating:3.8 },
  { id:'D018', name:'Aniket Gupta', licenseNumber:'HR5520210089012', licenseExpiry:'2029-05-30', status:'on-trip', currentVehicleId:'V018', currentJobId:'J018', riskScore:'low', hoursThisWeek:28, phone:'+91-98765-43227', joinDate:'2021-09-14', violations:0, depot:'Delhi', rating:4.7 },

  // Assigned (ready to depart) (8)
  { id:'D019', name:'Santosh Jadhav', licenseNumber:'MH0220210090123', licenseExpiry:'2029-04-22', status:'on-trip', currentVehicleId:'V019', currentJobId:'J019', riskScore:'low', hoursThisWeek:20, phone:'+91-98765-43228', joinDate:'2021-12-01', violations:0, depot:'Mumbai South', rating:4.8 },
  { id:'D020', name:'Vikram Kolekar', licenseNumber:'MH0120200001234', licenseExpiry:'2028-07-10', status:'on-trip', currentVehicleId:'V020', currentJobId:'J020', riskScore:'low', hoursThisWeek:18, phone:'+91-98765-43229', joinDate:'2020-10-18', violations:1, depot:'Mumbai South', rating:4.5 },
  { id:'D021', name:'Mohan Krishnan', licenseNumber:'KA0320190012345', licenseExpiry:'2027-11-28', status:'on-trip', currentVehicleId:'V021', currentJobId:'J021', riskScore:'low', hoursThisWeek:22, phone:'+91-98765-43230', joinDate:'2019-07-22', violations:0, depot:'Bengaluru', rating:4.7 },
  { id:'D022', name:'Naresh Bisht', licenseNumber:'DL1020210023456', licenseExpiry:'2029-09-15', status:'on-trip', currentVehicleId:'V022', currentJobId:'J022', riskScore:'low', hoursThisWeek:16, phone:'+91-98765-43231', joinDate:'2021-06-05', violations:0, depot:'Delhi', rating:4.9 },
  { id:'D023', name:'Bharat Meena', licenseNumber:'RJ0120220034567', licenseExpiry:'2030-01-20', status:'on-trip', currentVehicleId:'V023', currentJobId:'J023', riskScore:'low', hoursThisWeek:14, phone:'+91-98765-43232', joinDate:'2022-01-10', violations:0, depot:'Jaipur', rating:4.8 },
  { id:'D024', name:'Ganesan Pillai', licenseNumber:'TN0920200045678', licenseExpiry:'2028-06-08', status:'on-trip', currentVehicleId:'V024', currentJobId:'J024', riskScore:'low', hoursThisWeek:20, phone:'+91-98765-43233', joinDate:'2020-03-15', violations:0, depot:'Chennai', rating:4.7 },
  { id:'D025', name:'Srikanth Rao', licenseNumber:'TS0920210056789', licenseExpiry:'2029-10-12', status:'on-trip', currentVehicleId:'V025', currentJobId:'J025', riskScore:'low', hoursThisWeek:18, phone:'+91-98765-43234', joinDate:'2021-08-20', violations:0, depot:'Hyderabad', rating:4.9 },
  { id:'D026', name:'Dinesh Godse', licenseNumber:'MH4320190067890', licenseExpiry:'2027-03-25', status:'on-trip', currentVehicleId:'V026', currentJobId:'J026', riskScore:'low', hoursThisWeek:22, phone:'+91-98765-43235', joinDate:'2019-12-08', violations:1, depot:'Nashik', rating:4.4 },

  // Available (6)
  { id:'D027', name:'Prasad Naik', licenseNumber:'MH0520230078901', licenseExpiry:'2031-05-15', status:'available', riskScore:'low', hoursThisWeek:0, phone:'+91-98765-43236', joinDate:'2023-04-01', violations:0, depot:'Mumbai North', rating:4.8 },
  { id:'D028', name:'Krishnamurthy S', licenseNumber:'KA2020220089012', licenseExpiry:'2030-08-20', status:'available', riskScore:'low', hoursThisWeek:6, phone:'+91-98765-43237', joinDate:'2022-07-15', violations:0, depot:'Bengaluru', rating:4.7 },
  { id:'D029', name:'Rajender Singh', licenseNumber:'DL0420220090123', licenseExpiry:'2030-11-30', status:'available', riskScore:'low', hoursThisWeek:4, phone:'+91-98765-43238', joinDate:'2022-09-22', violations:0, depot:'Delhi', rating:4.9 },
  { id:'D030', name:'Anand Pillai', licenseNumber:'TN0420230001234', licenseExpiry:'2031-02-14', status:'available', riskScore:'low', hoursThisWeek:8, phone:'+91-98765-43239', joinDate:'2023-01-08', violations:0, depot:'Chennai', rating:4.8 },
  { id:'D031', name:'Siddharth Kumar', licenseNumber:'UP4520220012345', licenseExpiry:'2030-04-18', status:'available', riskScore:'medium', hoursThisWeek:2, phone:'+91-98765-43240', joinDate:'2022-05-20', violations:2, depot:'Lucknow', rating:4.2 },
  { id:'D032', name:'Amol Deshmukh', licenseNumber:'MH4320230023456', licenseExpiry:'2031-07-22', status:'available', riskScore:'low', hoursThisWeek:0, phone:'+91-98765-43241', joinDate:'2023-06-01', violations:0, depot:'Nashik', rating:4.9 },

  // Off Duty (2)
  { id:'D033', name:'Girish Waghmare', licenseNumber:'MH0120180034567', licenseExpiry:'2026-08-10', status:'off-duty', riskScore:'medium', hoursThisWeek:50, phone:'+91-98765-43242', joinDate:'2018-04-12', violations:3, depot:'Mumbai North', rating:3.7 },
  { id:'D034', name:'Chandrakant More', licenseNumber:'MH0420190045678', licenseExpiry:'2027-06-15', status:'off-duty', riskScore:'low', hoursThisWeek:48, phone:'+91-98765-43243', joinDate:'2019-08-25', violations:1, depot:'Pune', rating:4.3 },

  // On Leave (1)
  { id:'D035', name:'Pradeep Joshi', licenseNumber:'MH0120200056789', licenseExpiry:'2028-01-20', status:'on-leave', riskScore:'low', hoursThisWeek:0, phone:'+91-98765-43244', joinDate:'2020-02-14', violations:0, depot:'Mumbai South', rating:4.6 },
]

// ─── Jobs: 42 ─────────────────────────────────────────────────────────────────
// Unassigned: 7 | Assigned: 8 | In Transit: 18 | Delivered: 7 | Cancelled: 2

const today = '2026-10-11'

export const jobs: Job[] = [
  // In Transit (18) - linked to V001-V018
  { id:'J001', jobNumber:'TO-2610-001', customer:'Reliance Retail Ltd', origin:'Mumbai APMC, Navi Mumbai', destination:'Pune Phata Warehouse, Pune', scheduledPickup:`${today}T06:00:00`, scheduledDelivery:`${today}T12:00:00`, actualPickup:`${today}T06:20:00`, priority:'high', status:'in-transit', cargoType:'FMCG / Packaged Foods', requiredCapacityKg:22000, estimatedDistanceKm:148, estimatedCostINR:18500, assignedVehicleId:'V001', assignedDriverId:'D001' },
  { id:'J002', jobNumber:'TO-2610-002', customer:'Tata Steel Limited', origin:'Pune Industrial Area, Pune', destination:'Nashik Plant, Nashik', scheduledPickup:`${today}T07:00:00`, scheduledDelivery:`${today}T13:30:00`, actualPickup:`${today}T07:15:00`, priority:'critical', status:'in-transit', cargoType:'Steel Coils', requiredCapacityKg:17000, estimatedDistanceKm:211, estimatedCostINR:26400, assignedVehicleId:'V002', assignedDriverId:'D002', delayMinutes:22 },
  { id:'J003', jobNumber:'TO-2610-003', customer:'Amazon India Pvt Ltd', origin:'Bhiwandi Warehouse, Thane', destination:'Bandra Distribution, Mumbai', scheduledPickup:`${today}T05:30:00`, scheduledDelivery:`${today}T08:30:00`, actualPickup:`${today}T05:45:00`, priority:'high', status:'in-transit', cargoType:'E-commerce Parcels', requiredCapacityKg:8000, estimatedDistanceKm:52, estimatedCostINR:6500, assignedVehicleId:'V003', assignedDriverId:'D003' },
  { id:'J004', jobNumber:'TO-2610-004', customer:'Asian Paints Ltd', origin:'Kasur Factory, Rajkot', destination:'Ahmedabad Depot, Ahmedabad', scheduledPickup:`${today}T08:00:00`, scheduledDelivery:`${today}T15:00:00`, actualPickup:`${today}T08:30:00`, priority:'medium', status:'in-transit', cargoType:'Paints & Chemicals', requiredCapacityKg:28000, estimatedDistanceKm:218, estimatedCostINR:27200, assignedVehicleId:'V004', assignedDriverId:'D004', delayMinutes:45 },
  { id:'J005', jobNumber:'TO-2610-005', customer:'HPCL Petroleum', origin:'Kandla Port, Kutch', destination:'Vadodara Fuel Depot, Vadodara', scheduledPickup:`${today}T04:00:00`, scheduledDelivery:`${today}T14:00:00`, actualPickup:`${today}T04:00:00`, priority:'critical', status:'in-transit', cargoType:'Petroleum Products', requiredCapacityKg:15000, estimatedDistanceKm:312, estimatedCostINR:39000, assignedVehicleId:'V005', assignedDriverId:'D005' },
  { id:'J006', jobNumber:'TO-2610-006', customer:'Hindustan Unilever', origin:'Jaipur Factory, Jaipur', destination:'Delhi Distribution, New Delhi', scheduledPickup:`${today}T06:30:00`, scheduledDelivery:`${today}T14:30:00`, actualPickup:`${today}T06:45:00`, priority:'high', status:'in-transit', cargoType:'FMCG Products', requiredCapacityKg:25000, estimatedDistanceKm:279, estimatedCostINR:34900, assignedVehicleId:'V006', assignedDriverId:'D006' },
  { id:'J007', jobNumber:'TO-2610-007', customer:'Flipkart Internet Pvt', origin:'Kundli Warehouse, Sonipat', destination:'Noida Fulfilment Centre, Noida', scheduledPickup:`${today}T07:00:00`, scheduledDelivery:`${today}T10:00:00`, actualPickup:`${today}T07:00:00`, priority:'medium', status:'in-transit', cargoType:'E-commerce Parcels', requiredCapacityKg:26000, estimatedDistanceKm:72, estimatedCostINR:9000, assignedVehicleId:'V007', assignedDriverId:'D007' },
  { id:'J008', jobNumber:'TO-2610-008', customer:'Blue Dart Express', origin:'Delhi Air Cargo, New Delhi', destination:'Gurgaon Sortation Hub, Gurgaon', scheduledPickup:`${today}T06:00:00`, scheduledDelivery:`${today}T08:30:00`, actualPickup:`${today}T06:10:00`, priority:'critical', status:'in-transit', cargoType:'Express Parcels', requiredCapacityKg:2500, estimatedDistanceKm:38, estimatedCostINR:4700, assignedVehicleId:'V008', assignedDriverId:'D008' },
  { id:'J009', jobNumber:'TO-2610-009', customer:'Decathlon Sports India', origin:'Bengaluru Electronics City, Bengaluru', destination:'Hyderabad Store, Hyderabad', scheduledPickup:`${today}T05:00:00`, scheduledDelivery:`${today}T16:00:00`, actualPickup:`${today}T05:05:00`, priority:'medium', status:'in-transit', cargoType:'Sporting Goods', requiredCapacityKg:20000, estimatedDistanceKm:568, estimatedCostINR:71000, assignedVehicleId:'V009', assignedDriverId:'D009' },
  { id:'J010', jobNumber:'TO-2610-010', customer:'Café Coffee Day', origin:'Hassan Coffee Estate, Hassan', destination:'Bengaluru Processing, Bengaluru', scheduledPickup:`${today}T07:00:00`, scheduledDelivery:`${today}T12:00:00`, actualPickup:`${today}T07:20:00`, priority:'low', status:'in-transit', cargoType:'Agricultural Produce', requiredCapacityKg:10000, estimatedDistanceKm:183, estimatedCostINR:22900, assignedVehicleId:'V010', assignedDriverId:'D010' },
  { id:'J011', jobNumber:'TO-2610-011', customer:'Dalmia Bharat Ltd', origin:'Chennai Port, Chennai', destination:'Vizag Plant, Visakhapatnam', scheduledPickup:`${today}T03:00:00`, scheduledDelivery:`${today}T18:00:00`, actualPickup:`${today}T03:30:00`, priority:'high', status:'in-transit', cargoType:'Cement & Clinker', requiredCapacityKg:33000, estimatedDistanceKm:766, estimatedCostINR:95700, assignedVehicleId:'V011', assignedDriverId:'D011', delayMinutes:58 },
  { id:'J012', jobNumber:'TO-2610-012', customer:'Chennai Petroleum Corp', origin:'Manali Refinery, Chennai', destination:'Trichy Depot, Tiruchirappalli', scheduledPickup:`${today}T04:30:00`, scheduledDelivery:`${today}T12:30:00`, actualPickup:`${today}T04:30:00`, priority:'critical', status:'in-transit', cargoType:'Petroleum Products', requiredCapacityKg:15000, estimatedDistanceKm:328, estimatedCostINR:41000, assignedVehicleId:'V012', assignedDriverId:'D012' },
  { id:'J013', jobNumber:'TO-2610-013', customer:'Infosys Technologies', origin:'Hyderabad Rajiv Gandhi IT Park', destination:'Bengaluru Data Centre, Bengaluru', scheduledPickup:`${today}T06:00:00`, scheduledDelivery:`${today}T16:30:00`, actualPickup:`${today}T06:00:00`, priority:'high', status:'in-transit', cargoType:'IT Equipment', requiredCapacityKg:24000, estimatedDistanceKm:572, estimatedCostINR:71500, assignedVehicleId:'V013', assignedDriverId:'D013' },
  { id:'J014', jobNumber:'TO-2610-014', customer:'ITC Limited', origin:'Lucknow Factory, Lucknow', destination:'Delhi Warehouse, New Delhi', scheduledPickup:`${today}T07:30:00`, scheduledDelivery:`${today}T15:00:00`, actualPickup:`${today}T07:45:00`, priority:'medium', status:'in-transit', cargoType:'FMCG Goods', requiredCapacityKg:12000, estimatedDistanceKm:502, estimatedCostINR:62700, assignedVehicleId:'V014', assignedDriverId:'D014' },
  { id:'J015', jobNumber:'TO-2610-015', customer:'Haldia Petrochemicals', origin:'Haldia Port, Haldia', destination:'Kolkata Distribution, Kolkata', scheduledPickup:`${today}T05:00:00`, scheduledDelivery:`${today}T09:30:00`, actualPickup:`${today}T05:00:00`, priority:'critical', status:'in-transit', cargoType:'Chemical Products', requiredCapacityKg:23000, estimatedDistanceKm:124, estimatedCostINR:15500, assignedVehicleId:'V015', assignedDriverId:'D015' },
  { id:'J016', jobNumber:'TO-2610-016', customer:'Mercedes-Benz India', origin:'Chakan Plant, Pune', destination:'Mumbai Port Trust, Mumbai', scheduledPickup:`${today}T08:00:00`, scheduledDelivery:`${today}T12:00:00`, actualPickup:`${today}T08:00:00`, priority:'high', status:'in-transit', cargoType:'Auto Components', requiredCapacityKg:6500, estimatedDistanceKm:145, estimatedCostINR:18100, assignedVehicleId:'V016', assignedDriverId:'D016' },
  { id:'J017', jobNumber:'TO-2610-017', customer:'ONGC Ltd', origin:'Hazira Gas Plant, Surat', destination:'Vadodara Storage, Vadodara', scheduledPickup:`${today}T04:00:00`, scheduledDelivery:`${today}T10:00:00`, actualPickup:`${today}T04:00:00`, priority:'critical', status:'in-transit', cargoType:'Natural Gas Products', requiredCapacityKg:32000, estimatedDistanceKm:148, estimatedCostINR:18500, assignedVehicleId:'V017', assignedDriverId:'D017' },
  { id:'J018', jobNumber:'TO-2610-018', customer:'Mother Dairy Fruit & Veg', origin:'Delhi Processing Unit, Delhi', destination:'Faridabad Distribution, Faridabad', scheduledPickup:`${today}T06:00:00`, scheduledDelivery:`${today}T09:00:00`, actualPickup:`${today}T06:05:00`, priority:'high', status:'in-transit', cargoType:'Dairy Products (Refrigerated)', requiredCapacityKg:10000, estimatedDistanceKm:38, estimatedCostINR:4700, assignedVehicleId:'V018', assignedDriverId:'D018' },

  // Assigned - not yet started (8) - linked to V019-V026
  { id:'J019', jobNumber:'TO-2610-019', customer:'Big Bazaar (Future Retail)', origin:'Mumbai South Depot, Mumbai', destination:'Ratnagiri Store, Ratnagiri', scheduledPickup:`${today}T14:00:00`, scheduledDelivery:`${today}T21:00:00`, priority:'medium', status:'assigned', cargoType:'Retail Goods', requiredCapacityKg:700, estimatedDistanceKm:348, estimatedCostINR:43500, assignedVehicleId:'V019', assignedDriverId:'D019' },
  { id:'J020', jobNumber:'TO-2610-020', customer:'JK Cement Ltd', origin:'Mumbai JNPT, Navi Mumbai', destination:'Goa Port, Panaji', scheduledPickup:`${today}T15:00:00`, scheduledDelivery:`${today}T23:00:00`, priority:'high', status:'assigned', cargoType:'Cement Bags', requiredCapacityKg:52000, estimatedDistanceKm:584, estimatedCostINR:73000, assignedVehicleId:'V020', assignedDriverId:'D020' },
  { id:'J021', jobNumber:'TO-2610-021', customer:'Apollo Tyres Ltd', origin:'Bengaluru Factory, Bengaluru', destination:'Chennai Warehouse, Chennai', scheduledPickup:`${today}T13:30:00`, scheduledDelivery:`${today}T19:30:00`, priority:'medium', status:'assigned', cargoType:'Tyres & Tubes', requiredCapacityKg:10500, estimatedDistanceKm:347, estimatedCostINR:43400, assignedVehicleId:'V021', assignedDriverId:'D021' },
  { id:'J022', jobNumber:'TO-2610-022', customer:'IKEA India Pvt Ltd', origin:'Delhi NCR Warehouse, Gurgaon', destination:'Chandigarh Store, Chandigarh', scheduledPickup:`${today}T14:30:00`, scheduledDelivery:`${today}T19:00:00`, priority:'low', status:'assigned', cargoType:'Furniture & Home Goods', requiredCapacityKg:24000, estimatedDistanceKm:248, estimatedCostINR:31000, assignedVehicleId:'V022', assignedDriverId:'D022' },
  { id:'J023', jobNumber:'TO-2610-023', customer:'RNS Motors (Maruti Dealer)', origin:'Jaipur Autoparts Hub, Jaipur', destination:'Udaipur Showroom, Udaipur', scheduledPickup:`${today}T12:00:00`, scheduledDelivery:`${today}T17:30:00`, priority:'medium', status:'assigned', cargoType:'Auto Parts', requiredCapacityKg:9000, estimatedDistanceKm:242, estimatedCostINR:30200, assignedVehicleId:'V023', assignedDriverId:'D023' },
  { id:'J024', jobNumber:'TO-2610-024', customer:'Murugappa Group', origin:'Chennai Factory, Chennai', destination:'Coimbatore Plant, Coimbatore', scheduledPickup:`${today}T13:00:00`, scheduledDelivery:`${today}T19:00:00`, priority:'medium', status:'assigned', cargoType:'Industrial Components', requiredCapacityKg:14000, estimatedDistanceKm:496, estimatedCostINR:62000, assignedVehicleId:'V024', assignedDriverId:'D024' },
  { id:'J025', jobNumber:'TO-2610-025', customer:'Dr. Reddy\'s Laboratories', origin:'Hyderabad API Division, Hyderabad', destination:'Vijayawada Plant, Vijayawada', scheduledPickup:`${today}T14:00:00`, scheduledDelivery:`${today}T19:30:00`, priority:'high', status:'assigned', cargoType:'Pharmaceutical Raw Materials', requiredCapacityKg:28000, estimatedDistanceKm:271, estimatedCostINR:33900, assignedVehicleId:'V025', assignedDriverId:'D025' },
  { id:'J026', jobNumber:'TO-2610-026', customer:'Marico Industries', origin:'Nashik Manufacturing, Nashik', destination:'Aurangabad Depot, Aurangabad', scheduledPickup:`${today}T15:30:00`, scheduledDelivery:`${today}T19:00:00`, priority:'low', status:'assigned', cargoType:'FMCG Products', requiredCapacityKg:2200, estimatedDistanceKm:118, estimatedCostINR:14700, assignedVehicleId:'V026', assignedDriverId:'D026' },

  // Unassigned (7) - awaiting dispatch
  { id:'J027', jobNumber:'TO-2610-027', customer:'HCL Technologies Ltd', origin:'Noida Special Economic Zone, Noida', destination:'Bengaluru Global Village Tech Park', scheduledPickup:`${today}T16:00:00`, scheduledDelivery:'2026-10-12T10:00:00', priority:'high', status:'unassigned', cargoType:'Server Hardware', requiredCapacityKg:18000, estimatedDistanceKm:2180, estimatedCostINR:272500 },
  { id:'J028', jobNumber:'TO-2610-028', customer:'Aditya Birla Retail', origin:'Mumbai Central Warehouse, Mumbai', destination:'Indore Depot, Indore', scheduledPickup:`${today}T17:00:00`, scheduledDelivery:'2026-10-12T06:00:00', priority:'medium', status:'unassigned', cargoType:'Retail Merchandise', requiredCapacityKg:21000, estimatedDistanceKm:572, estimatedCostINR:71500 },
  { id:'J029', jobNumber:'TO-2610-029', customer:'Britannia Industries', origin:'Ranjangaon Factory, Pune', destination:'Kolhapur Distribution, Kolhapur', scheduledPickup:`${today}T14:30:00`, scheduledDelivery:`${today}T20:30:00`, priority:'medium', status:'unassigned', cargoType:'Biscuits & Bakery', requiredCapacityKg:14000, estimatedDistanceKm:221, estimatedCostINR:27600, notes:'Requires refrigerated storage section' },
  { id:'J030', jobNumber:'TO-2610-030', customer:'Godrej Consumer Products', origin:'Goa Plant, Panaji', destination:'Mumbai Warehouse, Mumbai', scheduledPickup:`${today}T13:00:00`, scheduledDelivery:`${today}T21:00:00`, priority:'high', status:'unassigned', cargoType:'Consumer Products', requiredCapacityKg:19000, estimatedDistanceKm:602, estimatedCostINR:75200 },
  { id:'J031', jobNumber:'TO-2610-031', customer:'Pidilite Industries', origin:'Ankleshwar Factory, Bharuch', destination:'Pune Depot, Pune', scheduledPickup:`${today}T15:00:00`, scheduledDelivery:'2026-10-12T07:00:00', priority:'low', status:'unassigned', cargoType:'Adhesives & Chemicals', requiredCapacityKg:22000, estimatedDistanceKm:468, estimatedCostINR:58500 },
  { id:'J032', jobNumber:'TO-2610-032', customer:'Tata Chemicals Ltd', origin:'Mithapur Plant, Jamnagar', destination:'Mumbai Depot, Mumbai', scheduledPickup:`${today}T16:30:00`, scheduledDelivery:'2026-10-12T08:00:00', priority:'critical', status:'unassigned', cargoType:'Industrial Chemicals', requiredCapacityKg:30000, estimatedDistanceKm:982, estimatedCostINR:122700, notes:'HAZMAT — requires certified driver' },
  { id:'J033', jobNumber:'TO-2610-033', customer:'Vedanta Resources', origin:'Tuticorin Smelter, Tuticorin', destination:'Chennai Port, Chennai', scheduledPickup:`${today}T18:00:00`, scheduledDelivery:`${today}T23:00:00`, priority:'high', status:'unassigned', cargoType:'Metal Ingots', requiredCapacityKg:28000, estimatedDistanceKm:144, estimatedCostINR:18000 },

  // Delivered (7)
  { id:'J034', jobNumber:'TO-2610-034', customer:'Nestlé India Ltd', origin:'Moga Factory, Moga', destination:'Delhi Warehouse, New Delhi', scheduledPickup:`${today}T00:00:00`, scheduledDelivery:`${today}T07:00:00`, actualPickup:`${today}T00:00:00`, actualDelivery:`${today}T06:55:00`, priority:'high', status:'delivered', cargoType:'Dairy Products', requiredCapacityKg:24000, estimatedDistanceKm:488, estimatedCostINR:61000, assignedVehicleId:'V027', assignedDriverId:'D027' },
  { id:'J035', jobNumber:'TO-2610-035', customer:'Sun Pharma Industries', origin:'Ankleshwar Plant, Bharuch', destination:'Ahmedabad Distribution, Ahmedabad', scheduledPickup:`${today}T01:00:00`, scheduledDelivery:`${today}T05:00:00`, actualPickup:`${today}T01:00:00`, actualDelivery:`${today}T04:48:00`, priority:'critical', status:'delivered', cargoType:'Pharmaceutical Goods', requiredCapacityKg:8000, estimatedDistanceKm:112, estimatedCostINR:14000, assignedVehicleId:'V028', assignedDriverId:'D028' },
  { id:'J036', jobNumber:'TO-2610-036', customer:'Wipro Enterprises', origin:'Hosur Factory, Krishnagiri', destination:'Bengaluru Office, Bengaluru', scheduledPickup:`${today}T02:00:00`, scheduledDelivery:`${today}T05:00:00`, actualPickup:`${today}T02:15:00`, actualDelivery:`${today}T05:28:00`, priority:'medium', status:'delivered', cargoType:'Office Equipment', requiredCapacityKg:9000, estimatedDistanceKm:48, estimatedCostINR:6000, assignedVehicleId:'V029', assignedDriverId:'D029', delayMinutes:28 },
  { id:'J037', jobNumber:'TO-2610-037', customer:'Raymond Ltd', origin:'Vapi Factory, Vapi', destination:'Mumbai Showroom, Mumbai', scheduledPickup:`${today}T01:30:00`, scheduledDelivery:`${today}T06:30:00`, actualPickup:`${today}T01:30:00`, actualDelivery:`${today}T06:22:00`, priority:'high', status:'delivered', cargoType:'Textiles & Fabrics', requiredCapacityKg:7000, estimatedDistanceKm:184, estimatedCostINR:23000, assignedVehicleId:'V030', assignedDriverId:'D030' },
  { id:'J038', jobNumber:'TO-2610-038', customer:'Patanjali Ayurved', origin:'Haridwar Factory, Haridwar', destination:'Delhi Distribution, New Delhi', scheduledPickup:`${today}T00:30:00`, scheduledDelivery:`${today}T06:00:00`, actualPickup:`${today}T00:30:00`, actualDelivery:`${today}T05:58:00`, priority:'medium', status:'delivered', cargoType:'FMCG / Wellness Products', requiredCapacityKg:18000, estimatedDistanceKm:228, estimatedCostINR:28500, assignedVehicleId:'V031', assignedDriverId:'D031' },
  { id:'J039', jobNumber:'TO-2610-039', customer:'TVS Motor Company', origin:'Hosur Plant, Krishnagiri', destination:'Chennai Port, Chennai', scheduledPickup:`${today}T03:00:00`, scheduledDelivery:`${today}T07:30:00`, actualPickup:`${today}T03:10:00`, actualDelivery:`${today}T07:52:00`, priority:'high', status:'delivered', cargoType:'Two-Wheelers (Export)', requiredCapacityKg:19000, estimatedDistanceKm:48, estimatedCostINR:6000, assignedVehicleId:'V032', assignedDriverId:'D032', delayMinutes:22 },
  { id:'J040', jobNumber:'TO-2610-040', customer:'UltraTech Cement Ltd', origin:'Gulbarga Plant, Kalaburagi', destination:'Hyderabad Site, Hyderabad', scheduledPickup:`${today}T01:00:00`, scheduledDelivery:`${today}T06:00:00`, actualPickup:`${today}T01:00:00`, actualDelivery:`${today}T05:55:00`, priority:'medium', status:'delivered', cargoType:'Cement', requiredCapacityKg:22000, estimatedDistanceKm:212, estimatedCostINR:26500, assignedVehicleId:'V033', assignedDriverId:'D033' },

  // Cancelled (2)
  { id:'J041', jobNumber:'TO-2610-041', customer:'Hindustan Aeronautics', origin:'Bengaluru HAL, Bengaluru', destination:'Mumbai Defence, Mumbai', scheduledPickup:`${today}T08:00:00`, scheduledDelivery:`${today}T20:00:00`, priority:'critical', status:'cancelled', cargoType:'Aerospace Components', requiredCapacityKg:20000, estimatedDistanceKm:984, estimatedCostINR:123000, notes:'Cancelled — customs clearance pending' },
  { id:'J042', jobNumber:'TO-2610-042', customer:'PVR Cinemas Ltd', origin:'Noida Studio, Noida', destination:'Jaipur Venue, Jaipur', scheduledPickup:`${today}T09:00:00`, scheduledDelivery:`${today}T17:00:00`, priority:'low', status:'cancelled', cargoType:'AV Equipment', requiredCapacityKg:2000, estimatedDistanceKm:238, estimatedCostINR:29700, notes:'Cancelled — event postponed' },
]

// ─── Incidents: 12 open ───────────────────────────────────────────────────────
// Critical: 2 | High: 3 | Medium: 2 | Low: 1 (Open = 8) | Investigating: 2 | Resolved: 2

export const incidents: Incident[] = [
  { id:'I001', type:'accident', severity:'critical', vehicleId:'V004', driverId:'D004', timestamp:'2026-10-11T09:14:00', description:'Minor rear collision at Nadiad crossing. V004 (GJ01EF4567) rear-ended a stationary truck due to brake lag at traffic signal. Reported by driver. Police notified.', status:'investigating', location:'Nadiad Highway, NH-48, Gujarat', assignedTo:'Arjun Mehta', actionHistory:[{timestamp:'2026-10-11T09:22:00', action:'Incident reported by driver D004', by:'Vijay Yadav'},{timestamp:'2026-10-11T09:35:00', action:'Safety officer assigned. Police FIR being filed.', by:'Arjun Mehta'}] },
  { id:'I002', type:'breakdown', severity:'critical', vehicleId:'V011', driverId:'D011', timestamp:'2026-10-11T07:45:00', description:'V011 (TN01ST1234) reported engine failure near Nellore bypass. Vehicle is stationary on highway shoulder. Driver safe. Cargo is time-sensitive cement delivery.', status:'open', location:'NH-16, Nellore Bypass, Andhra Pradesh', assignedTo:'Arjun Mehta', actionHistory:[{timestamp:'2026-10-11T07:50:00', action:'Breakdown reported. Mechanic team dispatched from Nellore depot.', by:'Arjun Mehta'},{timestamp:'2026-10-11T08:20:00', action:'Mechanic team ETA: 45 minutes', by:'System'}] },
  { id:'I003', type:'speeding', severity:'high', vehicleId:'V017', driverId:'D017', timestamp:'2026-10-11T08:30:00', description:'V017 flagged by highway camera for sustained speed of 104 km/h in 80 km/h zone on NH-48 Surat–Vadodara stretch. Third speeding event for D017 this quarter.', status:'open', location:'NH-48, Surat–Vadodara Expressway', assignedTo:'Arjun Mehta', actionHistory:[{timestamp:'2026-10-11T08:35:00', action:'Automatic speed alert triggered. Driver warned via call.', by:'System'},{timestamp:'2026-10-11T08:40:00', action:'Driver acknowledged. Speed reduced.', by:'Harish Patel'}] },
  { id:'I004', type:'fatigue', severity:'high', vehicleId:'V008', driverId:'D008', timestamp:'2026-10-11T06:00:00', description:'D008 (Rohit Verma) logged 44 hours this week. Trip log shows no rest stop in past 6 hours. Fatigue risk protocol triggered.', status:'open', location:'Delhi–Gurgaon Expressway, Haryana', assignedTo:'Arjun Mehta', actionHistory:[{timestamp:'2026-10-11T06:05:00', action:'Fatigue alert triggered. Driver advised to take mandatory 30-minute rest break.', by:'System'}] },
  { id:'I005', type:'overload', severity:'high', vehicleId:'V015', driverId:'D015', timestamp:'2026-10-10T22:15:00', description:'V015 (WB01AB5678) weigh-bridge reading at Durgapur check-post showed 27.2t cargo against permitted 25t for this vehicle. Overloading by 8.8%.', status:'investigating', location:'Durgapur Checkpost, West Bengal', assignedTo:'Arjun Mehta', actionHistory:[{timestamp:'2026-10-10T22:20:00', action:'Weigh-bridge penalty issued. Vehicle cleared after partial offloading.', by:'Arjun Mehta'},{timestamp:'2026-10-10T23:00:00', action:'Investigation into loading process initiated.', by:'Arjun Mehta'}] },
  { id:'I006', type:'near-miss', severity:'medium', vehicleId:'V002', driverId:'D002', timestamp:'2026-10-11T08:10:00', description:'D002 (Suresh Patil) reported near-miss with motorcycle at Uruli Kanchan toll plaza. No contact made. Driver filed self-report proactively.', status:'open', location:'Pune–Solapur Highway, Uruli Kanchan', assignedTo:'Arjun Mehta', actionHistory:[{timestamp:'2026-10-11T08:15:00', action:'Self-report received from driver. Acknowledged.', by:'Arjun Mehta'}] },
  { id:'I007', type:'theft', severity:'medium', vehicleId:'V026', driverId:'D026', timestamp:'2026-10-10T23:45:00', description:'D026 (Dinesh Godse) reported attempted break-in at Nashik highway rest area. Cargo seal intact. Side window scratched. Police complaint filed.', status:'open', location:'Nashik Highway Rest Area, Maharashtra', assignedTo:'Arjun Mehta', actionHistory:[{timestamp:'2026-10-10T23:50:00', action:'Driver notified police. Cargo checked and sealed intact.', by:'Dinesh Godse'},{timestamp:'2026-10-11T00:20:00', action:'Police complaint number: MH-2026-8821 filed.', by:'Arjun Mehta'}] },
  { id:'I008', type:'other', severity:'low', vehicleId:'V003', driverId:'D003', timestamp:'2026-10-11T05:30:00', description:'V003 (MH14CD3456) headlamp on driver side reported dim by driver during pre-trip inspection. Vehicle passed safety check but headlamp noted for maintenance.', status:'open', location:'Bhiwandi Depot, Maharashtra', assignedTo:'Arjun Mehta', actionHistory:[{timestamp:'2026-10-11T05:35:00', action:'Maintenance ticket raised: MAINT-2026-0412', by:'System'}] },
  // Resolved
  { id:'I009', type:'breakdown', severity:'high', vehicleId:'V042', driverId:'D027', timestamp:'2026-10-09T14:22:00', description:'V042 tyre blowout on Mumbai–Pune Expressway. Driver safe. Vehicle towed to depot for repair.', status:'resolved', location:'Mumbai–Pune Expressway, Km 68', assignedTo:'Arjun Mehta', resolution:'Tyre replaced. Vehicle in maintenance bay. Expected operational in 48 hours.', actionHistory:[{timestamp:'2026-10-09T14:30:00', action:'Tow truck dispatched', by:'Arjun Mehta'},{timestamp:'2026-10-09T16:00:00', action:'Vehicle at depot. Maintenance started.', by:'System'},{timestamp:'2026-10-10T09:00:00', action:'Repair completed. Marked resolved.', by:'Arjun Mehta'}] },
  { id:'I010', type:'speeding', severity:'medium', vehicleId:'V034', driverId:'D034', timestamp:'2026-10-08T11:15:00', description:'Speed camera recorded V034 at 96km/h in 80km/h zone. First offence for D034.', status:'resolved', location:'Jaipur–Ajmer NH-48', assignedTo:'Arjun Mehta', resolution:'Driver counselled. Warning letter issued. No further incidents.', actionHistory:[{timestamp:'2026-10-08T11:20:00', action:'Alert issued. Driver notified.', by:'System'},{timestamp:'2026-10-08T12:00:00', action:'Driver counselling session completed.', by:'Arjun Mehta'}] },
  { id:'I011', type:'accident', severity:'critical', vehicleId:'V044', driverId:'D033', timestamp:'2026-10-05T16:45:00', description:'V044 was involved in a side-collision at Rohini intersection. Vehicle damage significant. Driver minor injuries treated.', status:'closed', location:'Rohini Intersection, New Delhi', assignedTo:'Arjun Mehta', resolution:'Insurance claim filed. Driver medically cleared. Vehicle in extended maintenance. Root cause: wet road condition + driver misjudged stopping distance.', actionHistory:[{timestamp:'2026-10-05T17:00:00', action:'Incident reported. Medical team dispatched.', by:'System'},{timestamp:'2026-10-05T18:00:00', action:'Driver hospitalised and treated. Insurance claim initiated.', by:'Arjun Mehta'},{timestamp:'2026-10-08T10:00:00', action:'Investigation completed. Closed.', by:'Arjun Mehta'}] },
  { id:'I012', type:'fatigue', severity:'low', vehicleId:'V036', driverId:'D035', timestamp:'2026-10-07T04:30:00', description:'D035 flagged for 44-hour week. Pre-trip fatigue assessment suggested light duty rest. Trip deferred by 3 hours.', status:'closed', location:'Kolkata North Depot, West Bengal', assignedTo:'Arjun Mehta', resolution:'Driver rested 3 hours. Trip reassigned and completed without incident.', actionHistory:[{timestamp:'2026-10-07T04:35:00', action:'Fatigue flag raised. Rest mandated.', by:'System'},{timestamp:'2026-10-07T07:45:00', action:'Driver rested. Cleared for duty.', by:'Arjun Mehta'}] },
]

// ─── Compliance Records ───────────────────────────────────────────────────────

export const complianceRecords: ComplianceRecord[] = [
  // Expired or expiring vehicles
  { id:'C001', entityType:'vehicle', entityId:'V044', type:'registration', expiryDate:'2026-09-30', status:'expired' },
  { id:'C002', entityType:'vehicle', entityId:'V044', type:'fitness', expiryDate:'2026-09-30', status:'expired' },
  { id:'C003', entityType:'vehicle', entityId:'V047', type:'insurance', expiryDate:'2026-09-15', status:'expired' },
  { id:'C004', entityType:'vehicle', entityId:'V047', type:'permit', expiryDate:'2026-09-20', status:'expired' },
  { id:'C005', entityType:'vehicle', entityId:'V048', type:'fitness', expiryDate:'2026-09-10', status:'expired' },
  { id:'C006', entityType:'vehicle', entityId:'V004', type:'fitness', expiryDate:'2026-10-15', status:'expiring-soon' },
  { id:'C007', entityType:'vehicle', entityId:'V011', type:'insurance', expiryDate:'2026-10-20', status:'expiring-soon' },
  { id:'C008', entityType:'vehicle', entityId:'V017', type:'permit', expiryDate:'2026-10-25', status:'expiring-soon' },
  { id:'C009', entityType:'vehicle', entityId:'V035', type:'fitness', expiryDate:'2026-10-30', status:'expiring-soon' },
  // Driver license expiring
  { id:'C010', entityType:'driver', entityId:'D004', type:'license', expiryDate:'2025-11-30', status:'expired' },
  { id:'C011', entityType:'driver', entityId:'D011', type:'license', expiryDate:'2024-12-31', status:'expired' },
  { id:'C012', entityType:'driver', entityId:'D009', type:'license', expiryDate:'2026-09-20', status:'expiring-soon' },
  { id:'C013', entityType:'driver', entityId:'D015', type:'license', expiryDate:'2026-11-30', status:'expiring-soon' },
]

// ─── Dispatch Recommendations ─────────────────────────────────────────────────

export const recommendations: DispatchRecommendation[] = [
  {
    id:'R001', jobId:'J027', recommendedVehicleId:'V035', recommendedDriverId:'D031',
    alternativeVehicleId:'V029', alternativeDriverId:'D031',
    estimatedDistanceKm:2180, estimatedTimeMin:1740, estimatedCostINR:272500,
    reasons:['V035 (31t capacity) meets 18t requirement with 72% fill', 'D031 has 2 hours this week — well within HOS limits', 'Route via NH-44 has no active weather alerts', 'ETA aligns with destination 10:00 window'],
    warnings:['Long-haul trip (29h). Driver rest stops required at Nagpur and Hyderabad'],
    status:'pending', score:88, createdAt:'2026-10-11T14:15:00'
  },
  {
    id:'R002', jobId:'J028', recommendedVehicleId:'V038', recommendedDriverId:'D032',
    alternativeVehicleId:'V037', alternativeDriverId:'D032',
    estimatedDistanceKm:572, estimatedTimeMin:660, estimatedCostINR:71500,
    reasons:['V038 available in Mumbai, matches required 21t', 'D032 is fully rested (0h this week)', 'Overnight journey avoids peak traffic on NH-52'],
    warnings:[],
    status:'approved', approvedBy:'Priya Sharma', score:94, createdAt:'2026-10-11T13:45:00'
  },
  {
    id:'R003', jobId:'J029', recommendedVehicleId:'V037', recommendedDriverId:'D027',
    alternativeVehicleId:'V028', alternativeDriverId:'D027',
    estimatedDistanceKm:221, estimatedTimeMin:210, estimatedCostINR:27600,
    reasons:['V037 (tanker, 16t) provides 87% fill for 14t cargo', 'D027 is available and rested', 'Afternoon pickup fits cargo handling schedule at origin'],
    warnings:['Note: Britannia requires refrigerated section. Confirm V037 refrigeration unit is operational.'],
    status:'pending', score:76, createdAt:'2026-10-11T14:30:00'
  },
  {
    id:'R004', jobId:'J030', recommendedVehicleId:'V028', recommendedDriverId:'D028',
    alternativeVehicleId:'V040', alternativeDriverId:'D030',
    estimatedDistanceKm:602, estimatedTimeMin:720, estimatedCostINR:75200,
    reasons:['V028 (25t) meets 19t requirement', 'D028 is rested and has Goa–Mumbai route familiarity', 'Return load opportunity available from Mumbai'],
    warnings:['High-priority job. Confirm pickup slot with Godrej dispatch.'],
    status:'pending', score:82, createdAt:'2026-10-11T14:00:00'
  },
  {
    id:'R005', jobId:'J032', recommendedVehicleId:'V029', recommendedDriverId:'D029',
    alternativeVehicleId:'V040', alternativeDriverId:'D031',
    estimatedDistanceKm:982, estimatedTimeMin:900, estimatedCostINR:122700,
    reasons:['V029 (49t) has ample capacity for 30t HAZMAT load', 'D029 holds HAZMAT endorsement on licence', 'Overnight run avoids NH-8 peak hours'],
    warnings:['HAZMAT cargo. Verify all permits and emergency cards are on vehicle before departure.', 'Mandatory police escort required through city limits.'],
    status:'rejected', approvedBy:'Priya Sharma', overrideReason:'HAZMAT permit renewal pending. Cannot dispatch until clearance.', score:71, createdAt:'2026-10-11T12:00:00'
  },
]

// ─── 14-day Daily Metrics (for charts) ───────────────────────────────────────

export const dailyMetrics: DailyMetric[] = [
  { date:'2026-09-28', onTimeDeliveries:34, totalDeliveries:38, onTimeRate:89.5, utilization:79, incidentCount:1, costPerTripINR:24200, emptyReturnRate:22 },
  { date:'2026-09-29', onTimeDeliveries:29, totalDeliveries:33, onTimeRate:87.9, utilization:77, incidentCount:0, costPerTripINR:23800, emptyReturnRate:24 },
  { date:'2026-09-30', onTimeDeliveries:31, totalDeliveries:34, onTimeRate:91.2, utilization:80, incidentCount:2, costPerTripINR:24500, emptyReturnRate:21 },
  { date:'2026-10-01', onTimeDeliveries:36, totalDeliveries:40, onTimeRate:90.0, utilization:83, incidentCount:1, costPerTripINR:23900, emptyReturnRate:19 },
  { date:'2026-10-02', onTimeDeliveries:38, totalDeliveries:42, onTimeRate:90.5, utilization:86, incidentCount:0, costPerTripINR:24100, emptyReturnRate:20 },
  { date:'2026-10-03', onTimeDeliveries:32, totalDeliveries:36, onTimeRate:88.9, utilization:78, incidentCount:1, costPerTripINR:24800, emptyReturnRate:25 },
  { date:'2026-10-04', onTimeDeliveries:26, totalDeliveries:29, onTimeRate:89.7, utilization:72, incidentCount:0, costPerTripINR:23600, emptyReturnRate:23 },
  { date:'2026-10-05', onTimeDeliveries:35, totalDeliveries:39, onTimeRate:89.7, utilization:81, incidentCount:2, costPerTripINR:24300, emptyReturnRate:22 },
  { date:'2026-10-06', onTimeDeliveries:37, totalDeliveries:41, onTimeRate:90.2, utilization:84, incidentCount:1, costPerTripINR:24000, emptyReturnRate:20 },
  { date:'2026-10-07', onTimeDeliveries:33, totalDeliveries:37, onTimeRate:89.2, utilization:80, incidentCount:1, costPerTripINR:24400, emptyReturnRate:24 },
  { date:'2026-10-08', onTimeDeliveries:30, totalDeliveries:34, onTimeRate:88.2, utilization:77, incidentCount:0, costPerTripINR:23700, emptyReturnRate:26 },
  { date:'2026-10-09', onTimeDeliveries:36, totalDeliveries:40, onTimeRate:90.0, utilization:82, incidentCount:2, costPerTripINR:24200, emptyReturnRate:22 },
  { date:'2026-10-10', onTimeDeliveries:34, totalDeliveries:38, onTimeRate:89.5, utilization:80, incidentCount:1, costPerTripINR:24100, emptyReturnRate:23 },
  { date:'2026-10-11', onTimeDeliveries:6, totalDeliveries:7, onTimeRate:85.7, utilization:82, incidentCount:5, costPerTripINR:24400, emptyReturnRate:21 }, // today, partial
]

// ─── Helper Lookups ───────────────────────────────────────────────────────────

export const vehicleById = (id?: string) => id ? vehicles.find(v => v.id === id) : undefined
export const driverById = (id?: string) => id ? drivers.find(d => d.id === id) : undefined
export const jobById = (id?: string) => id ? jobs.find(j => j.id === id) : undefined

// ─── Fleet Summary (consistent KPIs) ─────────────────────────────────────────

export const fleetSummary = {
  total: 48,
  available: 15,
  assigned: 8,
  onTrip: 18,
  maintenance: 5,
  offline: 2,
}

export const driverSummary = {
  total: 35,
  onTrip: 26,   // 18 on trip + 8 assigned vehicles
  available: 6,
  offDuty: 2,
  onLeave: 1,
}

export const jobSummary = {
  total: 42,
  unassigned: 7,
  assigned: 8,
  inTransit: 18,
  delivered: 7,
  cancelled: 2,
}

export const incidentSummary = {
  open: 8,
  critical: 2,
  high: 3,
  medium: 2,
  low: 1,
  investigating: 2,
  resolved: 2,
}

export const todayKpis = {
  onTimeRate: 89,
  fleetUtilization: 82,
  activeTrips: 18,
  openExceptions: 7,
  emptyReturnRate: 23,
  avgTripDurationH: 4.2,
  pendingRecommendations: 3,
  complianceIssues: 6,
}
