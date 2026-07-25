{/* EVENTS TAB */}
        <TabsContent value="events" className="m-0 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Upcoming Events</h3>
              {upcomingLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No upcoming events right now.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <Card key={event.id} className="border-none shadow-sm hover:shadow-md transition-all">
                      <CardContent className="p-4 flex items-center gap-4">
                        {event.image_url ? (
                          <img src={event.image_url} alt={event.title} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <Calendar className="h-6 w-6 text-primary shrink-0" />
                        )}
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm">{event.title}</h4>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(event.event_date).toLocaleDateString()} • {event.location_name}
                          </p>
                        </div>
                        {user ? (
                          <Button
                            size="sm"
                            variant={registeredIds.has(event.id) ? "outline" : "default"}
                            className="rounded-full shrink-0"
                            disabled={pendingId === event.id}
                            onClick={() => (registeredIds.has(event.id) ? unregister(event.id) : register(event.id))}
                          >
                            {pendingId === event.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : registeredIds.has(event.id) ? '✓' : 'Join'}
                          </Button>
                        ) : (
                          <Button asChild size="sm" className="rounded-full shrink-0">
                            <Link to="/auth/login">Sign in</Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Completed Events</h3>
              {completedLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : completedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No completed events yet.</p>
              ) : (
                <div className="space-y-3">
                  {completedEvents.map(event => (
                    <Card key={event.id} className="border-none shadow-sm opacity-75">
                      <CardContent className="p-4 flex items-center gap-4">
                        {event.image_url ? (
                          <img src={event.image_url} alt={event.title} className="h-10 w-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <Calendar className="h-6 w-6 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm">{event.title}</h4>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(event.event_date).toLocaleDateString()} • {event.registered_count} participants
                          </p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-600 border-none text-[9px]">Done</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

