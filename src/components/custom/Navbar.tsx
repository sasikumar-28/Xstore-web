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
import { Menu } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
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
            {route.map((item, index) =>
              item?.children ? (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-primary flex justify-between">
                    {item?.link ? (
                      <div
                        onClick={() => navigate(String(item?.link))}
                        className="w-full text-left"
                      >
                        {item.name}
                      </div>
                    ) : (
                      item.name
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="ml-4 space-y-2">
                    {item.children?.map((child, index) =>
                      child.children ? (
                        <AccordionItem key={index} value={`child-${index}`}>
                          <AccordionTrigger className="text-sm font-semibold text-muted-foreground flex justify-between">
                            {child.link ? (
                              <div
                                onClick={() => navigate(String(child?.link))}
                                className="w-full text-left"
                              >
                                {child.name}
                              </div>
                            ) : (
                              child.name
                            )}
                          </AccordionTrigger>
                          <AccordionContent className="ml-6 space-y-1">
                            {child.children?.map((subChild, e) => (
                              <div
                                key={e}
                                className="text-xs text-muted-foreground hover:text-primary transition"
                              >
                                {subChild.link ? (
                                  <div
                                    className="cursor-pointer hover:underline"
                                    onClick={() =>
                                      navigate(String(subChild?.link))
                                    }
                                  >
                                    {subChild.name}
                                  </div>
                                ) : (
                                  subChild.name
                                )}
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ) : (
                        <div
                          key={index}
                          className="cursor-pointer hover:underline"
                          onClick={() => navigate(String(child?.link))}
                        >
                          {child.name}
                        </div>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => navigate(String(item?.link))}
                >
                  {item.name}
                </div>
              )
            )}
          </Accordion>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Navbar;
