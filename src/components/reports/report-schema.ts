import { z } from 'zod';

// Simplified per the reporting-module redesign: estimatedSize,
// affectedArea, immediateRisk, environmentalImpact, requiredAction, and
// severity are no longer collected from the user — severity and impact
// are now assessed automatically (generate_ai_assessment) after
// submission based on category + description, instead of asking the
// user to self-report them. date/time observed are silently captured
// at submission time rather than typed in.
export const reportSchema = z.object({
  category: z.string().min(1, 'Please select a hazard category'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  dateObserved: z.string().min(1),
  timeObserved: z.string().min(1),
  images: z.array(z.string()).min(1, 'At least one photo is required'),
  video: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(1, 'Address is required'),
    // ward/lga fall back through several OSM address fields
    // (suburb/neighbourhood/quarter, county/state_district/city_district)
    // that frequently don't exist for Nigerian locations — required here
    // meant the form could reach the Review step looking complete, then
    // silently refuse to submit (react-hook-form just doesn't call
    // onSubmit on a failed validation, with no visible error) whenever
    // reverse geocoding couldn't find a value for either field. state is
    // left required since Nominatim reliably returns it for any
    // Nigerian coordinate.
    ward: z.string().optional(),
    lga: z.string().optional(),
    state: z.string().min(1, 'State is required'),
    landmark: z.string().optional(),
  }),
  isAnonymous: z.boolean(),
  notifyVolunteers: z.boolean(),
  shareWithCommunity: z.boolean(),
  receiveUpdates: z.boolean(),
});

export type ReportFormData = z.infer<typeof reportSchema>;

export const defaultValues: Partial<ReportFormData> = {
  category: '',
  title: '',
  description: '',
  dateObserved: new Date().toISOString().split('T')[0],
  timeObserved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
  images: [],
  location: {
    lat: 9.0820,
    lng: 8.6753,
    address: '',
    ward: '',
    lga: '',
    state: '',
    landmark: '',
  },
  isAnonymous: false,
  notifyVolunteers: true,
  shareWithCommunity: true,
  receiveUpdates: true,
};
