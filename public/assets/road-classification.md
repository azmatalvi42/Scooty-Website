# PatchForce Priority & Scheduling Intelligence Guide

## Purpose

This file teaches PatchForce how to classify, prioritize, schedule, and route municipal infrastructure reports using Ontario’s Minimum Maintenance Standards framework.

PatchForce should use this file as a decision-support layer for civic issue reports related to roads, sidewalks, signs, traffic signals, lighting, snow, ice, debris, and surface defects.

This is not legal advice. The purpose is to help PatchForce structure reports, estimate urgency, generate SLA-style deadlines, and support municipal triage workflows.

---

# 1. Core Concept

Ontario municipal highways are classified from **Class 1 to Class 6** based on:

- Speed limit
- Average daily traffic volume

Higher-class roads are usually busier, faster, and higher priority.

| Highway Class | Meaning |
|---|---|
| Class 1 | Highest priority roads, usually high-speed/high-volume |
| Class 2 | Major roads with high operational importance |
| Class 3 | Important collector or arterial roads |
| Class 4 | Lower-volume municipal roads |
| Class 5 | Local/lower-priority roads |
| Class 6 | Generally not covered by O. Reg. 239/02 |

PatchForce should prioritize reports using:

1. Public safety risk
2. Issue type
3. Road/sidewalk class or context
4. Legal/maintenance response standard
5. Number of duplicate reports nearby
6. Proximity to sensitive areas
7. Weather conditions
8. Whether a significant weather event is active

Sensitive areas include:

- Schools
- Senior residences
- Hospitals
- Transit stops
- Busy intersections
- Crosswalks
- Bike lanes
- Major pedestrian corridors
- Accessibility routes

---

# 2. Global Priority Levels

PatchForce should use four main priority levels.

## Critical

Use when the issue may create immediate danger to drivers, pedestrians, cyclists, or traffic flow.

Examples:

- Traffic signal failure
- Conflicting traffic lights
- Missing stop sign
- Missing yield sign
- Large debris blocking active lane
- Icy road on major road
- Large pothole causing swerving
- Damaged pedestrian crossing signal
- Road hazard near school or major intersection
- Downed sign or pole creating immediate danger

Recommended handling:

- Mark as `critical`
- Notify admin/municipality immediately
- Display “urgent safety issue” warning
- SLA label: `Deploy resources as soon as practicable`
- Encourage user to call municipal emergency line if immediate danger exists

---

## High

Use when the issue is serious, likely actionable, or may worsen quickly.

Examples:

- Pothole above threshold
- Sidewalk trip hazard above 2 cm
- Multiple streetlights out
- Icy sidewalk
- Road snow beyond allowed threshold
- Damaged critical warning sign
- Shoulder drop-off above threshold
- Snow-covered bike lane
- Surface discontinuity above threshold

Recommended handling:

- Mark as `high`
- Assign SLA based on category and road class
- Prioritize before medium/low reports
- Group duplicate reports
- Show estimated repair/treatment timeline

---

## Medium

Use when the issue affects infrastructure quality but is not immediately dangerous.

Examples:

- Road crack above threshold
- General warning sign damaged
- Minor non-critical streetlight outage
- Surface deterioration
- Sidewalk obstruction that is not immediately hazardous
- Pothole near threshold but not clearly above it

Recommended handling:

- Mark as `medium`
- Schedule for inspection or routine maintenance
- Ask for photo/measurement confirmation
- Use longer SLA windows where applicable

---

## Low

Use when the report appears cosmetic, below threshold, unclear, duplicate, or non-urgent.

Examples:

- Small pothole below depth/area threshold
- Minor road wear
- Cosmetic sign damage
- One streetlight out in low-risk area
- Sidewalk unevenness under 2 cm
- Non-hazardous minor debris

Recommended handling:

- Mark as `low`
- Keep report visible
- Route to routine inspection queue
- Ask for more details if needed
- Upgrade automatically if duplicate reports increase

---

# 3. Awareness Rules

Many maintenance timelines start only after the municipality becomes aware of the issue.

PatchForce should track three awareness moments:

| Field | Meaning |
|---|---|
| `submitted_at` | When the citizen submitted the PatchForce report |
| `verified_at` | When PatchForce/admin verified the report |
| `municipality_aware_at` | When municipality was notified or became aware |
| `actual_knowledge_at` | Used for cases where the standard requires actual knowledge |

Default rule:

- Use `submitted_at` for citizen-facing tracking.
- Use `municipality_aware_at` for official SLA estimate.
- If the report has not been sent to the municipality yet, show SLA as “Not started officially.”

Recommended display:

> “Estimated maintenance timeline begins once the municipality is aware of the issue.”

---

# 4. Significant Weather Event Rule

Municipalities may declare a **Significant Weather Event** during severe snow, ice, or weather hazards.

When active:

- Normal snow/ice timelines may be paused or extended.
- Municipality must monitor weather.
- Municipality may deploy resources when practicable.
- Normal timelines resume after the municipality declares the event ended.

PatchForce should include:

```ts
significant_weather_event_active: boolean
significant_weather_event_started_at?: Date
significant_weather_event_ended_at?: Date
```

Citizen-facing message:

> “A Significant Weather Event may temporarily affect normal snow and ice response timelines.”

If active, PatchForce should:

- Keep accepting reports
- Mark reports as weather-affected
- Avoid showing strict overdue labels until the event ends
- Restart snow/ice countdowns after event end where applicable

---

# 5. Report Categories

PatchForce should use simple citizen-facing categories, then map them to deeper maintenance rules.

## Primary Categories

```ts
type PatchForceCategory =
  | "road_damage"
  | "sidewalk_hazard"
  | "traffic_signal_issue"
  | "damaged_or_missing_sign"
  | "streetlight_issue"
  | "road_debris"
  | "snow_or_ice"
  | "shoulder_or_road_edge"
  | "bridge_or_surface_issue"
  | "other";
```

## Internal Subcategories

```ts
type PatchForceSubcategory =
  | "pothole_paved_roadway"
  | "pothole_non_paved_roadway"
  | "pothole_shoulder"
  | "road_crack"
  | "road_surface_discontinuity"
  | "sidewalk_surface_discontinuity"
  | "sidewalk_encroachment"
  | "road_debris_hazard"
  | "streetlight_outage"
  | "critical_sign_issue"
  | "general_regulatory_warning_sign_issue"
  | "traffic_signal_defect"
  | "bridge_deck_spall"
  | "shoulder_dropoff"
  | "road_snow_accumulation"
  | "bike_lane_snow_accumulation"
  | "sidewalk_snow_accumulation"
  | "road_ice"
  | "sidewalk_ice";
```

---

# 6. Pothole Rules

A pothole is actionable under the maintenance standard only if it exceeds both:

1. Surface area threshold
2. Depth threshold

## Paved Roadway Potholes

| Road Class | Surface Area | Depth | Repair Time |
|---|---:|---:|---:|
| Class 1 | 600 cm² | 8 cm | 4 days |
| Class 2 | 800 cm² | 8 cm | 4 days |
| Class 3 | 1000 cm² | 8 cm | 7 days |
| Class 4 | 1000 cm² | 8 cm | 14 days |
| Class 5 | 1000 cm² | 8 cm | 30 days |

Priority logic:

```ts
if pothole.depthCm > threshold.depthCm
  and pothole.surfaceAreaCm2 > threshold.surfaceAreaCm2:
    assign SLA by road class
    if roadClass in [1, 2]: priority = "high"
    else priority = "medium"
else:
    priority = "low_or_needs_review"
```

Upgrade to `critical` if:

- Vehicles are swerving
- Pothole is in an intersection
- Pothole is near bike lane
- Pothole caused injury/damage
- Multiple reports in same location
- Located on Class 1 or Class 2 road with heavy traffic

Citizen questions:

- Is it on the road, shoulder, bike lane, or sidewalk?
- Is the road paved?
- How deep does it look?
- How wide/long does it look?
- Are vehicles swerving?
- Upload a photo.
- Confirm exact location.

---

## Non-Paved Roadway Potholes

| Road Class | Surface Area | Depth | Repair Time |
|---|---:|---:|---:|
| Class 3 | 1500 cm² | 8 cm | 7 days |
| Class 4 | 1500 cm² | 10 cm | 14 days |
| Class 5 | 1500 cm² | 12 cm | 30 days |

Default priority:

- Class 3: high/medium
- Class 4: medium
- Class 5: medium/low

Upgrade if public safety risk is high.

---

## Shoulder Potholes

| Road Class | Surface Area | Depth | Repair Time |
|---|---:|---:|---:|
| Class 1 | 1500 cm² | 8 cm | 7 days |
| Class 2 | 1500 cm² | 8 cm | 7 days |
| Class 3 | 1500 cm² | 8 cm | 14 days |
| Class 4 | 1500 cm² | 10 cm | 30 days |
| Class 5 | 1500 cm² | 12 cm | 60 days |

Default priority:

- High if on busy road or unsafe shoulder
- Medium otherwise
- Low if minor or unclear

---

# 7. Road Debris Rules

Definition:

Debris is material or an object on a roadway that is not part of the road and is reasonably likely to damage a vehicle or injure a person.

Examples:

- Branches
- Metal
- Glass
- Construction material
- Fallen signs
- Loose cargo
- Large garbage
- Dead animal blocking travel path

Standard:

- Deploy resources as soon as practicable after becoming aware.

PatchForce rule:

```ts
if debris.blocks_lane or debris.causes_swerve or debris.near_intersection:
    priority = "critical"
else:
    priority = "high"
```

SLA label:

```txt
Deploy resources as soon as practicable
```

Citizen questions:

- Is it blocking a lane?
- Are vehicles swerving?
- Is it near an intersection?
- Is anyone in immediate danger?
- Upload photo if safe.
- Confirm location.

---

# 8. Traffic Signal Rules

Traffic signal issues are usually critical.

Covered defects:

- Conflicting signals
- Signal head turned or misaligned
- Missing vehicle or pedestrian phase
- Timing error
- Power failure
- Signal cabinet displaced
- Failed support structure
- Signal lamp not working
- Pedestrian signal not working
- Incorrect flashing mode

Standard:

- Deploy resources as soon as practicable after becoming aware.

Exception:

If the only issue is a non-functioning green light or pedestrian “walk” signal, and all approaches are under 80 km/h, repair may be by the end of the next business day.

PatchForce rule:

```ts
if signal.conflicting or signal.powerFailure or signal.allDirectionsAffected:
    priority = "critical"
    slaLabel = "Deploy resources as soon as practicable"
elif signal.greenOnlyOrWalkOnly and speedLimitUnder80:
    priority = "high"
    slaLabel = "Repair by end of next business day"
else:
    priority = "critical"
```

Citizen questions:

- Is the whole light out?
- Are signals conflicting?
- Is it flashing incorrectly?
- Is the pedestrian signal broken?
- Is traffic moving unsafely?
- Which intersection?
- Upload photo/video if safe.

---

# 9. Damaged or Missing Sign Rules

## Critical Signs

Critical signs include:

- Stop
- Yield
- Do Not Enter
- One Way
- Wrong Way
- Stop Ahead
- Yield Ahead
- School Zone Speed Limit
- Traffic Signal Ahead
- Low Bridge
- Low Bridge Ahead
- Load Restricted Bridge
- Curve sign with advisory speed
- Two-Way Traffic Ahead
- Checkerboard

If any of these are missing, illegible, obscured, or improperly oriented:

- Deploy resources as soon as practicable.

PatchForce rule:

```ts
if sign.type in criticalSigns:
    priority = "critical"
    slaLabel = "Deploy resources as soon as practicable"
else:
    use general regulatory/warning sign SLA
```

---

## General Regulatory or Warning Signs

| Road Class | Repair Time |
|---|---:|
| Class 1 | 7 days |
| Class 2 | 14 days |
| Class 3 | 21 days |
| Class 4 | 30 days |
| Class 5 | 30 days |

Default priority:

- High for Class 1 or 2
- Medium for Class 3, 4, or 5
- Critical if it creates immediate confusion/danger

Citizen questions:

- What type of sign is damaged/missing?
- Is it readable?
- Is it facing the wrong direction?
- Is it blocked by trees/snow/objects?
- Is it near an intersection/school/crosswalk?
- Upload photo.
- Confirm location.

---

# 10. Streetlight / Luminaire Rules

Inspection standard:

- Once per calendar year
- No more than 16 months between inspections

Repair standard applies when:

- 3 or more consecutive luminaires on the same side are out
- 30% or more of luminaires on any kilometre are out
- High mast lighting has major failure patterns

| Road Class | Repair Time |
|---|---:|
| Class 1 | 7 days |
| Class 2 | 7 days |
| Class 3 | 14 days |
| Class 4 | 14 days |
| Class 5 | 14 days |

PatchForce rule:

```ts
if streetlights.consecutiveOut >= 3:
    priority = "high"
    assign SLA by road class
elif streetlights.areaDarknessHigh or nearSensitiveArea:
    priority = "high"
else:
    priority = "medium"
```

Upgrade to critical if:

- Complete darkness at dangerous intersection
- Near school/crosswalk/transit stop
- Multiple reports
- Combined with crime/safety concern

Citizen questions:

- Is one light out or multiple?
- Are 3+ consecutive lights out?
- Is the area very dark?
- Is it near a crosswalk, school, or transit stop?
- Pole number if visible.
- Upload photo.
- Confirm location.

---

# 11. Road Crack Rules

A road crack becomes actionable if:

- Width is greater than 5 cm
- Depth is greater than 5 cm
- Continuous distance is 3 metres or more

| Road Class | Repair Time |
|---|---:|
| Class 1 | 30 days |
| Class 2 | 30 days |
| Class 3 | 60 days |
| Class 4 | 180 days |
| Class 5 | 180 days |

PatchForce rule:

```ts
if crack.widthCm > 5 and crack.depthCm > 5 and crack.lengthM >= 3:
    assign SLA by road class
    priority = roadClass in [1,2] ? "medium" : "low_or_medium"
else:
    priority = "low"
```

Upgrade if:

- Cyclist hazard
- Motorcycle hazard
- Located at intersection
- Has sharp vertical edge
- Multiple reports
- Near school/crosswalk

Citizen questions:

- Is the crack wide/deep?
- Is it longer than 3 metres?
- Is it causing vehicles or cyclists to avoid it?
- Upload photo.
- Confirm location.

---

# 12. Shoulder Drop-Off Rules

A shoulder drop-off is actionable if:

- Deeper than 8 cm
- Continuous for 20 metres or more

| Road Class | Repair Time |
|---|---:|
| Class 1 | 4 days |
| Class 2 | 4 days |
| Class 3 | 7 days |
| Class 4 | 14 days |
| Class 5 | 30 days |

PatchForce rule:

```ts
if shoulderDropoff.depthCm > 8 and shoulderDropoff.lengthM >= 20:
    assign SLA by road class
    priority = roadClass in [1,2,3] ? "high" : "medium"
else:
    priority = "low_or_needs_review"
```

Upgrade if:

- High-speed road
- Narrow road
- No guardrail
- Cyclist/motorcycle risk
- Vehicle already damaged

Citizen questions:

- Is the shoulder lower than the road?
- Does it continue for a long distance?
- Is it on a high-speed road?
- Upload photo/video if safe.
- Confirm location.

---

# 13. Road Surface Discontinuity Rules

A road surface discontinuity means a vertical step at joints or cracks in the paved roadway.

If height exceeds 5 cm:

| Road Class | Repair Time |
|---|---:|
| Class 1 | 2 days |
| Class 2 | 2 days |
| Class 3 | 7 days |
| Class 4 | 21 days |
| Class 5 | 21 days |

Bridge deck discontinuity:

- If above 5 cm, deploy resources as soon as practicable.

PatchForce rule:

```ts
if discontinuity.onBridge and discontinuity.heightCm > 5:
    priority = "critical_or_high"
    slaLabel = "Deploy resources as soon as practicable"
elif discontinuity.heightCm > 5:
    assign SLA by road class
    priority = roadClass in [1,2] ? "high" : "medium"
else:
    priority = "low"
```

---

# 14. Bridge Deck Spall Rules

A bridge deck spall is a cavity caused by fragments detaching from the paved surface of a bridge roadway or shoulder.

| Road Class | Surface Area | Depth | Repair Time |
|---|---:|---:|---:|
| Class 1 | 600 cm² | 8 cm | 4 days |
| Class 2 | 800 cm² | 8 cm | 4 days |
| Class 3 | 1000 cm² | 8 cm | 7 days |
| Class 4 | 1000 cm² | 8 cm | 7 days |
| Class 5 | 1000 cm² | 8 cm | 7 days |

PatchForce rule:

```ts
if bridgeSpall.surfaceAreaCm2 > threshold.surfaceAreaCm2
  and bridgeSpall.depthCm > threshold.depthCm:
    assign SLA by road class
    priority = "high"
else:
    priority = "medium_or_needs_review"
```

Upgrade to critical if:

- On bridge travel lane
- Causes swerving
- Exposes structural concern
- Multiple reports

---

# 15. Sidewalk Surface Discontinuity Rules

A sidewalk surface discontinuity is a vertical height difference at:

- Joint
- Crack
- Utility cover
- Maintenance hole
- Sidewalk surface

Actionable if:

- Height difference exceeds 2 cm

Standard:

- Treat within 14 days after actual knowledge.

Treatment can include:

- Temporary repair
- Permanent repair
- Warning users
- Blocking access

PatchForce rule:

```ts
if sidewalk.heightDifferenceCm > 2:
    priority = "high"
    slaDays = 14
    startsWhen = "actual_knowledge"
else:
    priority = "low_or_needs_review"
```

Upgrade to critical if:

- Injury occurred
- Wheelchair/stroller route blocked
- Near school/senior residence/transit stop
- Heavy pedestrian traffic
- Night visibility issue

Citizen questions:

- Is the sidewalk raised or sunken?
- Is the height difference more than 2 cm?
- Is it blocking accessibility?
- Has anyone tripped?
- Is it near a school, transit stop, or senior home?
- Upload photo with object for scale.
- Confirm location.

---

# 16. Sidewalk Encroachment Rules

An encroachment is something placed, installed, constructed, or planted within the highway that was not placed there by the municipality.

The area adjacent to a sidewalk extends from the sidewalk edge to the lesser of:

- Highway limit
- Back edge of curb
- 45 cm maximum

If municipality determines the encroachment is highly unusual or a significant pedestrian hazard:

- Treat within 28 days.

PatchForce rule:

```ts
if encroachment.blocksAccess or encroachment.significantHazard:
    priority = "medium_or_high"
    slaDays = 28
else:
    priority = "low"
```

Upgrade if:

- Blocks wheelchair access
- Forces pedestrians into road
- Sharp object
- Construction hazard
- Near school/senior/transit route

---

# 17. Snow Accumulation on Roads

The standard applies after snow accumulation has ended.

| Road Class | Depth Trigger | Time After Snow Ends |
|---|---:|---:|
| Class 1 | 2.5 cm | 4 hours |
| Class 2 | 5 cm | 6 hours |
| Class 3 | 8 cm | 12 hours |
| Class 4 | 8 cm | 16 hours |
| Class 5 | 10 cm | 24 hours |

PatchForce rule:

```ts
if snow.depthCm > threshold.depthCm and snow.hasEnded:
    slaDeadline = snowEndedAt + threshold.hours
    priority = roadClass in [1,2] ? "high" : "medium"
elif snow.depthCm > threshold.depthCm and not snow.hasEnded:
    priority = "monitoring"
else:
    priority = "low"
```

If significant weather event is active:

```ts
priority = "weather_affected"
pauseStrictSLA = true
```

Citizen questions:

- Is snow still falling?
- Approximate snow depth?
- Is road passable?
- Are vehicles stuck?
- Is it a main road or residential street?
- Confirm location.

---

# 18. Snow Accumulation on Bike Lanes

| Adjacent Road Class | Depth Trigger | Time After Snow Ends |
|---|---:|---:|
| Class 1 | 2.5 cm | 8 hours |
| Class 2 | 5 cm | 12 hours |
| Class 3 | 8 cm | 24 hours |
| Class 4 | 8 cm | 24 hours |
| Class 5 | 10 cm | 24 hours |

PatchForce rule:

```ts
if bikeLaneSnow.depthCm > threshold.depthCm and snow.hasEnded:
    assign SLA by adjacent road class
    priority = "medium_or_high"
else:
    priority = "monitoring_or_low"
```

Upgrade if:

- Forces cyclists into vehicle lane
- On major cycling corridor
- Near school or transit
- Multiple reports

---

# 19. Snow Accumulation on Sidewalks

After snow accumulation ends, the standard is:

- Reduce snow to 8 cm or less
- Provide minimum sidewalk width of 1 metre
- Complete within 48 hours

PatchForce rule:

```ts
if sidewalkSnow.depthCm > 8 and snow.hasEnded:
    slaHours = 48
    priority = "high"
elif sidewalkSnow.blocksAccessibility:
    priority = "critical_or_high"
else:
    priority = "monitoring_or_low"
```

If snow is still accumulating:

- Sidewalk is generally considered in repair until 48 hours after snow ends.

Citizen questions:

- Is snow still falling?
- Is the sidewalk blocked?
- Is there at least 1 metre of walking space?
- Is it near school/transit/senior residence?
- Upload photo.
- Confirm location.

---

# 20. Ice on Roads

Treatment timelines:

| Road Class | Treat Within |
|---|---:|
| Class 1 | 3 hours |
| Class 2 | 4 hours |
| Class 3 | 8 hours |
| Class 4 | 12 hours |
| Class 5 | 16 hours |

PatchForce rule:

```ts
if roadIcy:
    assign treatment SLA by road class
    priority = roadClass in [1,2] ? "critical" : "high"
```

Upgrade to critical if:

- Vehicles sliding
- Collision occurred
- Hill/bridge/intersection
- School/transit route
- Freezing rain event

If significant weather event is active:

- Mark weather-affected
- Do not show strict overdue state until event ends

Citizen questions:

- Is the road icy right now?
- Are cars sliding?
- Is it on a hill, bridge, or intersection?
- Has there been a crash?
- Confirm location.

---

# 21. Ice on Sidewalks

Standard:

- Treat icy sidewalk within 48 hours after municipality becomes aware.
- If municipality treated it, sidewalk is deemed in repair for 48 hours after treatment.

PatchForce rule:

```ts
if sidewalkIcy:
    priority = "high"
    slaHours = 48
```

Upgrade to critical if:

- Injury occurred
- Completely impassable
- Near transit/school/senior residence
- Accessibility route blocked

Citizen questions:

- Is it icy right now?
- Is the sidewalk passable?
- Has someone slipped?
- Is it near a school, transit stop, or senior residence?
- Upload photo/video if safe.
- Confirm location.

---

# 22. Winter Sidewalk Patrol Logic

If weather monitoring indicates a substantial probability of:

- Snow on sidewalks over 8 cm
- Ice formation on sidewalks
- Icy sidewalks

Then municipality should patrol representative sidewalks at intervals deemed necessary.

PatchForce should use this to create proactive monitoring alerts:

```ts
if forecast.snowExpectedCm > 8 or forecast.freezingRainRisk:
    createWinterMonitoringAlert()
```

Possible admin message:

> “Forecast suggests sidewalk snow/ice risk. Consider proactive inspection queue.”

---

# 23. Scheduling Engine

PatchForce should compute a report’s scheduling deadline using this order:

1. Identify category/subcategory
2. Determine if issue is safety-critical
3. Determine road class if applicable
4. Determine if threshold is met
5. Determine awareness start time
6. Determine if significant weather event applies
7. Calculate SLA deadline
8. Assign priority
9. Place in municipal/admin queue

Pseudo-code:

```ts
function classifyReport(report) {
  const category = detectCategory(report);
  const subcategory = detectSubcategory(report);
  const roadClass = getRoadClass(report.location);

  const immediateRisk = detectImmediateRisk(report);
  const threshold = getThreshold(subcategory, roadClass);
  const thresholdMet = evaluateThreshold(report.measurements, threshold);

  const weatherEventActive = getWeatherEventStatus(report.municipality);

  const priority = calculatePriority({
    subcategory,
    roadClass,
    immediateRisk,
    thresholdMet,
    weatherEventActive,
    sensitiveArea: report.nearSensitiveArea,
    duplicateCount: report.duplicateCount,
  });

  const sla = calculateSLA({
    subcategory,
    roadClass,
    thresholdMet,
    awarenessTime: report.municipalityAwareAt,
    snowEndedAt: report.snowEndedAt,
    weatherEventActive,
  });

  return {
    category,
    subcategory,
    roadClass,
    priority,
    thresholdMet,
    sla,
  };
}
```

---

# 24. SLA Start Rules

| Issue Type | SLA Starts When |
|---|---|
| Pothole | Municipality becomes aware |
| Road debris | Municipality becomes aware |
| Damaged critical sign | Municipality becomes aware |
| General sign | Municipality becomes aware |
| Traffic signal | Municipality becomes aware |
| Streetlight outage | Municipality becomes aware |
| Road crack | Municipality becomes aware |
| Shoulder drop-off | Municipality becomes aware |
| Road surface discontinuity | Municipality becomes aware |
| Bridge deck spall | Municipality becomes aware |
| Sidewalk discontinuity | Municipality has actual knowledge |
| Sidewalk encroachment | Municipality determines significant hazard |
| Road snow | Snow accumulation ends |
| Bike lane snow | Snow accumulation ends |
| Sidewalk snow | Snow accumulation ends |
| Road ice | Municipality becomes aware |
| Sidewalk ice | Municipality becomes aware |

---

# 25. Recommended Data Model

## Report

```ts
type Report = {
  id: string;
  userId?: string;

  category: PatchForceCategory;
  subcategory?: PatchForceSubcategory;

  description?: string;
  photos: string[];

  latitude: number;
  longitude: number;
  address?: string;
  municipalityId?: string;

  status: ReportStatus;
  priority: ReportPriority;

  roadClass?: 1 | 2 | 3 | 4 | 5 | 6;

  measurements?: {
    depthCm?: number;
    surfaceAreaCm2?: number;
    heightCm?: number;
    widthCm?: number;
    lengthM?: number;
    snowDepthCm?: number;
  };

  context?: {
    nearSchool?: boolean;
    nearTransitStop?: boolean;
    nearSeniorResidence?: boolean;
    nearHospital?: boolean;
    nearIntersection?: boolean;
    nearCrosswalk?: boolean;
    bikeLanePresent?: boolean;
    accessibilityRoute?: boolean;
    vehiclesSwerving?: boolean;
    injuryReported?: boolean;
    propertyDamageReported?: boolean;
    blocksLane?: boolean;
    blocksSidewalk?: boolean;
  };

  weather?: {
    snowStillFalling?: boolean;
    snowEndedAt?: string;
    icyConditions?: boolean;
    significantWeatherEventActive?: boolean;
  };

  duplicateGroupId?: string;
  duplicateCount?: number;

  submittedAt: string;
  verifiedAt?: string;
  municipalityAwareAt?: string;
  actualKnowledgeAt?: string;
  slaDueAt?: string;

  sourceRegulation?: "O. Reg. 239/02";
};
```

## Report Status

```ts
type ReportStatus =
  | "submitted"
  | "needs_review"
  | "verified"
  | "sent_to_municipality"
  | "municipality_acknowledged"
  | "scheduled"
  | "in_progress"
  | "resolved"
  | "closed"
  | "duplicate"
  | "not_municipal_responsibility";
```

## Priority

```ts
type ReportPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "monitoring"
  | "weather_affected";
```

## SLA Object

```ts
type SLAResult = {
  applies: boolean;
  label: string;
  startsWhen:
    | "submitted_at"
    | "verified_at"
    | "municipality_aware_at"
    | "actual_knowledge_at"
    | "snow_ended_at"
    | "municipality_determination";

  durationHours?: number;
  durationDays?: number;
  dueAt?: string;

  thresholdMet?: boolean;
  significantWeatherEventPaused?: boolean;

  notes?: string[];
};
```

---

# 26. Maintenance Standards Table

Create a database table for standards.

```sql
CREATE TABLE maintenance_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  regulation_source TEXT DEFAULT 'O. Reg. 239/02',
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,

  road_class INT,

  surface_area_cm2 NUMERIC,
  depth_cm NUMERIC,
  height_cm NUMERIC,
  width_cm NUMERIC,
  length_m NUMERIC,
  snow_depth_cm NUMERIC,

  response_hours NUMERIC,
  response_days NUMERIC,

  starts_when TEXT NOT NULL,
  sla_label TEXT NOT NULL,

  immediate_action BOOLEAN DEFAULT false,
  significant_weather_event_applicable BOOLEAN DEFAULT false,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# 27. Example Seed Data

```sql
INSERT INTO maintenance_standards
(category, subcategory, road_class, surface_area_cm2, depth_cm, response_days, starts_when, sla_label)
VALUES
('road_damage', 'pothole_paved_roadway', 1, 600, 8, 4, 'municipality_aware_at', 'Repair within 4 days'),
('road_damage', 'pothole_paved_roadway', 2, 800, 8, 4, 'municipality_aware_at', 'Repair within 4 days'),
('road_damage', 'pothole_paved_roadway', 3, 1000, 8, 7, 'municipality_aware_at', 'Repair within 7 days'),
('road_damage', 'pothole_paved_roadway', 4, 1000, 8, 14, 'municipality_aware_at', 'Repair within 14 days'),
('road_damage', 'pothole_paved_roadway', 5, 1000, 8, 30, 'municipality_aware_at', 'Repair within 30 days');

INSERT INTO maintenance_standards
(category, subcategory, height_cm, response_days, starts_when, sla_label)
VALUES
('sidewalk_hazard', 'sidewalk_surface_discontinuity', 2, 14, 'actual_knowledge_at', 'Treat within 14 days');

INSERT INTO maintenance_standards
(category, subcategory, response_hours, starts_when, sla_label, immediate_action)
VALUES
('traffic_signal_issue', 'traffic_signal_defect', NULL, 'municipality_aware_at', 'Deploy resources as soon as practicable', true),
('road_debris', 'road_debris_hazard', NULL, 'municipality_aware_at', 'Deploy resources as soon as practicable', true),
('damaged_or_missing_sign', 'critical_sign_issue', NULL, 'municipality_aware_at', 'Deploy resources as soon as practicable', true);

INSERT INTO maintenance_standards
(category, subcategory, road_class, response_hours, starts_when, sla_label)
VALUES
('snow_or_ice', 'road_ice', 1, 3, 'municipality_aware_at', 'Treat within 3 hours'),
('snow_or_ice', 'road_ice', 2, 4, 'municipality_aware_at', 'Treat within 4 hours'),
('snow_or_ice', 'road_ice', 3, 8, 'municipality_aware_at', 'Treat within 8 hours'),
('snow_or_ice', 'road_ice', 4, 12, 'municipality_aware_at', 'Treat within 12 hours'),
('snow_or_ice', 'road_ice', 5, 16, 'municipality_aware_at', 'Treat within 16 hours');

INSERT INTO maintenance_standards
(category, subcategory, response_hours, starts_when, sla_label, significant_weather_event_applicable)
VALUES
('snow_or_ice', 'sidewalk_ice', 48, 'municipality_aware_at', 'Treat within 48 hours', true),
('snow_or_ice', 'sidewalk_snow_accumulation', 48, 'snow_ended_at', 'Clear to 8 cm or less and provide 1m width within 48 hours', true);
```

---

# 28. Duplicate Detection

PatchForce should group similar reports near the same location.

Recommended duplicate radius:

| Report Type | Radius |
|---|---:|
| Pothole | 15 m |
| Sidewalk hazard | 10 m |
| Traffic signal | 30 m |
| Damaged sign | 20 m |
| Streetlight | 25 m |
| Road debris | 25 m |
| Snow/ice | 50-150 m |
| Road crack | 20 m |

Priority upgrade:

```ts
if duplicateCount >= 3:
    increasePriorityByOneLevel()
if duplicateCount >= 10:
    flagAsHotspot()
```

---

# 29. AI Classification Rules

When AI receives a user report, extract:

```json
{
  "category": "road_damage",
  "subcategory": "pothole_paved_roadway",
  "urgencySignals": ["vehicles_swerve", "near_intersection"],
  "measurements": {
    "depthCm": null,
    "surfaceAreaCm2": null
  },
  "locationConfidence": "high",
  "photoRequired": true,
  "priority": "high",
  "slaLabel": "Repair timeline depends on road class and whether the pothole exceeds threshold."
}
```

AI should never overclaim exact compliance.

Use wording like:

- “May require”
- “Estimated timeline”
- “Based on reported details”
- “Needs verification”
- “Official timelines may begin when the municipality becomes aware”

Avoid wording like:

- “The city is legally required”
- “This is definitely overdue”
- “The municipality is breaking the law”
- “Guaranteed repair time”

---

# 30. Citizen-Facing Language

## Pothole

> “Thanks for reporting this pothole. If it exceeds the provincial size and depth threshold, the estimated repair timeline depends on the road class and when the municipality becomes aware of it.”

## Sidewalk Trip Hazard

> “This may be a sidewalk surface discontinuity. If the height difference is over 2 cm, it may require treatment within an estimated 14 days after actual municipal knowledge.”

## Traffic Signal

> “Traffic signal issues can create immediate safety risks. This report will be treated as urgent and should be routed for review as soon as possible.”

## Missing Stop Sign

> “Missing or unreadable critical signs, such as stop or yield signs, are treated as urgent safety issues.”

## Snow/Ice

> “Snow and ice timelines depend on whether the snow has ended, road class, and whether the municipality has declared a Significant Weather Event.”

---

# 31. Admin-Facing SLA Labels

Use clear badges:

```txt
Deploy ASAP
Repair within 2 days
Repair within 4 days
Repair within 7 days
Repair within 14 days
Repair within 30 days
Treat within 48 hours
Inspection required
Below threshold
Needs verification
Weather event active
SLA not started
Overdue estimate
Duplicate hotspot
```

---

# 32. Priority Calculation Example

```ts
function calculatePriority(input) {
  const {
    subcategory,
    roadClass,
    immediateRisk,
    thresholdMet,
    nearSensitiveArea,
    duplicateCount,
    significantWeatherEventActive,
  } = input;

  if (significantWeatherEventActive && isWeatherRelated(subcategory)) {
    return "weather_affected";
  }

  if (immediateRisk) {
    return "critical";
  }

  if (
    subcategory === "traffic_signal_defect" ||
    subcategory === "critical_sign_issue" ||
    subcategory === "road_debris_hazard"
  ) {
    return "critical";
  }

  if (thresholdMet && roadClass && roadClass <= 2) {
    return "high";
  }

  if (thresholdMet) {
    return "medium";
  }

  if (nearSensitiveArea) {
    return "medium";
  }

  if (duplicateCount >= 3) {
    return "medium";
  }

  return "low";
}
```

---

# 33. Scheduling Deadline Example

```ts
function calculateDueDate(startTime, sla) {
  if (!sla || !sla.applies) return null;

  if (sla.significantWeatherEventPaused) {
    return null;
  }

  const start = new Date(startTime);

  if (sla.durationHours) {
    return new Date(start.getTime() + sla.durationHours * 60 * 60 * 1000);
  }

  if (sla.durationDays) {
    return new Date(start.getTime() + sla.durationDays * 24 * 60 * 60 * 1000);
  }

  return null;
}
```

---

# 34. Recommended MVP Scope

Start with these report types:

1. Pothole / Road Damage
2. Sidewalk Trip Hazard
3. Traffic Light Issue
4. Damaged or Missing Sign
5. Streetlight Outage
6. Road Debris
7. Snow / Ice Issue

Do not start with every edge case. Add bridge deck spalls, shoulder drop-offs, encroachments, and bike lane snow after MVP.

---

# 35. Claude Implementation Instructions

When using this file with Claude, instruct Claude to:

1. Use this as the authoritative PatchForce priority/scheduling guide.
2. Build simple citizen-facing UX first.
3. Keep deep regulatory logic in backend/config files.
4. Avoid legal overclaiming.
5. Generate modular TypeScript types.
6. Generate seed data for maintenance standards.
7. Create priority and SLA utility functions.
8. Build admin dashboard badges.
9. Use report photos and user answers to estimate priority.
10. Always distinguish between citizen submission time and municipality awareness time.

Claude should not:

- Overcomplicate the first user flow.
- Force users to enter exact measurements.
- Claim legal violation.
- Treat SLA as guaranteed repair time.
- Ignore significant weather events.
- Ignore road class.
- Ignore duplicate reports.
- Ignore sensitive areas.

---

# 36. Ideal PatchForce Product Behavior

PatchForce should feel simple to citizens and intelligent to municipalities.

Citizen experience:

1. Pick issue type
2. Answer 2-5 smart questions
3. Upload photo
4. Confirm location
5. Submit
6. See estimated priority and tracking status

Admin experience:

1. View incoming reports
2. See priority badge
3. See SLA estimate
4. See duplicate reports
5. See map cluster
6. Verify issue
7. Send/export to municipality
8. Track status
9. Close or mark duplicate

---

# 37. Core Product Positioning

PatchForce is not just a pothole reporting app.

PatchForce is a civic infrastructure intelligence platform that turns public reports into structured, prioritized, location-based maintenance tickets aligned with Ontario municipal maintenance standards.

Use this sentence as the product anchor:

> PatchForce helps residents report road, sidewalk, lighting, sign, snow, ice, and traffic signal issues while helping municipalities triage reports using structured priority and maintenance-standard logic.

---

# 38. Safety Disclaimer

PatchForce should include this disclaimer somewhere in the app:

> PatchForce provides estimated maintenance timelines based on reported details and publicly available maintenance standards. Official responsibility, repair decisions, and response timelines are determined by the relevant municipality.

For urgent danger:

> If there is immediate danger, call 911 or your local municipal emergency line.
