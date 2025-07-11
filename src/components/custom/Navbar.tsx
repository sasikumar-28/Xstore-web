import { getRoute } from "@/navigation/sideBarNavigation";
import { Button } from "../ui/button";
import { RouteParameter } from "@/type/route-type";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Navbar = () => {
  const navigate = useNavigate();
  const route: RouteParameter[] = getRoute();
  const [show, setShow] = useState(true);

  return (
    <>
      <div
        className="relative transition-all duration-500 ease-in-out"
        style={{ width: show ? "18rem" : "0" }}
      >
        <div
          className={` h-screen w-72 bg-white p-6 shadow-lg transition-transform duration-700 ease-in-out ${
            show ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center text-2xl font-semibold tracking-wide">
            <div>ASPIRE's AI</div>
            <div
              onClick={() => setShow(!show)}
              className={`cursor-pointer transition-transform duration-300 ${
                show ? "rotate-90" : "rotate-180"
              }`}
            >
              <Icon icon="ooui:expand" width="20" height="20" />
            </div>
          </div>

          <ScrollArea className="mt-4 h-[calc(100vh-100px)]">
            <Accordion type="multiple" className="space-y-4 mt-4">
              {route.map((item, index) =>
                item?.children ? (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-none"
                  >
                    <AccordionTrigger className="text-lg font-medium text-primary flex justify-between focus:outline-none -mt-3 pb-0">
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
                      {item.children?.map((child, idx) =>
                        child.children ? (
                          <AccordionItem
                            key={idx}
                            value={`child-${idx}`}
                            style={{ borderBottom: "none" }}
                          >
                            <AccordionTrigger className="text-sm text-muted-foreground flex justify-between">
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
                              {child.children?.map((subChild, e) =>
                                subChild.children ? (
                                  <AccordionItem
                                    key={e}
                                    value={`subChild-${e}`}
                                  >
                                    <AccordionTrigger className="text-sm text-muted-foreground flex justify-between font-normal">
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
                                        <div className="">{subChild.name}</div>
                                      )}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      {subChild.children?.map(
                                        (subSubChild, i) => (
                                          <div key={i} className="ml-6">
                                            {subSubChild.link ? (
                                              <div
                                                className="cursor-pointer hover:underline text-sm text-muted-foreground flex justify-between pb-2"
                                                onClick={() =>
                                                  navigate(
                                                    String(subSubChild?.link)
                                                  )
                                                }
                                              >
                                                {subSubChild.name}
                                              </div>
                                            ) : (
                                              <div className="text-sm font-medium pb-2 text-muted-foreground text-sm">
                                                {subSubChild.name}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </AccordionContent>
                                  </AccordionItem>
                                ) : (
                                  <div key={e}>
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
                                      <div className="text-sm font-medium">
                                        {subChild.name}
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ) : (
                          <div
                            key={idx}
                            className="cursor-pointer hover:underline text-sm text-muted-foreground flex justify-between pb-2"
                            onClick={() => navigate(String(child?.link))}
                            style={{ fontWeight: 500 }}
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
                    style={{
                      fontWeight: 600,
                      marginTop: "8px",
                    }}
                    className="cursor-pointer"
                    onClick={() =>
                      item.link?.includes("http")
                        ? window.open(String(item?.link), "_blank")
                        : navigate(String(item?.link))
                    }
                  >
                    {item.name}
                  </div>
                )
              )}
            </Accordion>
          </ScrollArea>
        </div>

        {/* Toggle Button (Appears when sidebar is closed) */}
      </div>
      {!show && (
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary bg-white rounded-full shadow-md -rotate-90 mt-5 ml-2"
            onClick={() => setShow(!show)}
          >
            <Icon icon="ooui:expand" width="20" height="20" />
          </Button>
        </div>
      )}
      {/* </Sheet> */}
    </>
  );
};

export default Navbar;
