import { getRoute } from "@/navigation/sideBarNavigation";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetContent,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { RouteParameter } from "@/type/route-type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Menu, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const Navbar = () => {
  const route: RouteParameter[] = getRoute();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-white p-6 w-64">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold tracking-wide">
            ASPIRE
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(100vh-100px)]">
          <Accordion type="multiple" className="space-y-4">
            {route.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-primary flex justify-between">
                  {item.name}
                </AccordionTrigger>
                <AccordionContent className="ml-4 space-y-2">
                  {item.children?.map((child, index) => (
                    <AccordionItem key={index} value={`child-${index}`}>
                      <AccordionTrigger className="text-sm font-semibold text-muted-foreground flex justify-between">
                        {child.name}
                      </AccordionTrigger>
                      <AccordionContent className="ml-6 space-y-1">
                        {child.children?.map((subChild, e) => (
                          <div
                            key={e}
                            className="text-xs text-muted-foreground hover:text-primary transition"
                          >
                            {subChild.name}
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;
