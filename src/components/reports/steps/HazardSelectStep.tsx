import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Check, Plus, Search } from 'lucide-react';
import { HAZARD_CATEGORIES } from '../HazardCategories';
import { cn } from '@/lib/utils';
import { ReportFormData } from '../report-schema';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const VISIBLE_COUNT = 8;

export default function HazardSelectStep() {
  const { setValue, watch, formState: { errors } } =
    useFormContext<ReportFormData>();

  const selectedCategory = watch('category');

  const [moreOpen, setMoreOpen] = useState(false);
  const [search, setSearch] = useState('');

  const visibleCategories = HAZARD_CATEGORIES.slice(0, VISIBLE_COUNT);

  const filteredCategories = HAZARD_CATEGORIES.filter((category) =>
    category.title.toLowerCase().includes(search.toLowerCase())
  );

  const selectCategory = (id: string) => {
    setValue('category', id as any, {
      shouldValidate: true,
    });
  };


  return (
    <div className="space-y-4">

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">

        {visibleCategories.map((category) => {
          const Icon = category.icon;
          const selected = selectedCategory === category.id;

          return (
            <motion.button
              key={category.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => selectCategory(category.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 py-3 px-1",
                "transition-all",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >

              <div
                className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center text-white",
                  category.color
                )}
              >
                <Icon className="h-4 w-4" />
              </div>


              <span className="text-[11px] font-semibold text-center leading-tight line-clamp-1">
                {category.title}
              </span>


              {selected && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}

            </motion.button>
          );
        })}


        {/* MORE BUTTON */}

        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border py-3 px-1"
        >

          <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </div>

          <span className="text-[11px] font-semibold">
            More
          </span>

        </motion.button>


      </div>


      {errors.category && (
        <p className="text-sm text-destructive font-medium">
          {errors.category.message}
        </p>
      )}



      {/* MORE SHEET */}

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>

        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-h-[80vh]"
        >

          <SheetHeader>
            <SheetTitle>
              All Hazard Categories
            </SheetTitle>
          </SheetHeader>


          <div className="mt-4 space-y-3">


            <div className="flex items-center gap-2 border rounded-lg px-3">

              <Search className="h-4 w-4 text-muted-foreground"/>

              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full py-2 outline-none text-sm"
              />

            </div>



            <div className="space-y-2 overflow-y-auto max-h-[55vh]">


              {filteredCategories.map((category)=>{

                const Icon = category.icon;
                const selected = selectedCategory === category.id;


                return (

                  <button
                    key={category.id}
                    type="button"
                    onClick={()=>{
                      selectCategory(category.id);
                      setMoreOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border",
                      selected && "border-primary bg-primary/5"
                    )}
                  >

                    <div
                      className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center text-white",
                        category.color
                      )}
                    >
                      <Icon className="h-4 w-4"/>
                    </div>


                    <span className="text-sm font-semibold">
                      {category.title}
                    </span>


                    {selected &&
                      <Check className="ml-auto h-4 w-4 text-primary"/>
                    }


                  </button>

                );

              })}


            </div>


          </div>


        </SheetContent>

      </Sheet>


    </div>
  );
 }
